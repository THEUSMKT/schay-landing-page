#!/usr/bin/env node
/**
 * ============================================================================
 * PRÉ-RENDERIZAÇÃO ESTÁTICA POR ROTA
 * ============================================================================
 *
 * Por quê: o GitHub Pages é hospedagem 100% estática, sem rewrite de
 * servidor. Antes deste script, uma URL direta como /casas/ dependia do
 * truque de public/404.html (github.com/rafgraph/spa-github-pages): o
 * GitHub Pages respondia 404 e um script em 404.html redirecionava pro
 * index.html, que then montava a rota certa via JS. Isso FUNCIONA pra quem
 * navega no navegador, mas a resposta HTTP inicial da URL era sempre 404 —
 * ruim pra SEO (crawlers que não seguem esse redirect client-side veem
 * "página não encontrada") e pra qualquer link direto.
 *
 * O que este script faz: depois do `vite build`, abre cada rota num
 * Chromium headless (Playwright), espera o React montar e rolar a página
 * inteira (pra disparar todo `whileInView` dos componentes <Reveal> — sem
 * isso, o HTML capturado teria seções com opacity:0 "travadas" assim caso
 * o JS falhe depois), injeta <title>/description/canonical/OG/JSON-LD
 * específicos da rota, e salva o HTML renderizado em dist/<rota>/index.html.
 * Isso faz o GitHub Pages responder 200 com conteúdo de verdade pra
 * qualquer rota, direto — sem depender do redirect de 404.html (que
 * continua publicado como rede de segurança pra rotas futuras não
 * pré-renderizadas).
 *
 * Alternativas consideradas: um framework de SSG/SSR completo (Next,
 * Astro, vite-plugin-ssr) resolveria isso "de fábrica", mas exigiria
 * reescrever a base do projeto (roteamento, build, hospedagem) só pra
 * ganhar HTML estático em 4 rotas — desproporcional aqui. Um script de
 * prerender com o Chromium que o próprio Playwright já baixa é a solução
 * mínima que resolve o problema real (status HTTP + conteúdo indexável)
 * sem trocar a arquitetura do site.
 *
 * Uso: node scripts/prerender.mjs --base=/schay-landing-page/
 * (rodado pelo workflow do GitHub Pages logo depois do `vite build`; ver
 * .github/workflows/deploy-pages.yml)
 */
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, writeFile, mkdir, rm, cp, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')

const PRODUCTION_URL = 'https://theusmkt.github.io/schay-landing-page'

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=')
    return [key, value ?? true]
  }),
)
const base = (args.base || '/').replace(/\/?$/, '/') // garante barra final

const OG_IMAGE = `${PRODUCTION_URL}/og-image.png`

const ROUTES = [
  {
    path: '/',
    outFile: 'index.html',
    description:
      'Schay Corretora — imóveis à venda em São Leopoldo e região. Casas, apartamentos e terrenos com atendimento próximo, do primeiro contato à entrega das chaves. CRECI 83.933F.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: 'Schay Corretora',
      url: `${PRODUCTION_URL}/`,
      image: OG_IMAGE,
      telephone: '+5551992789076',
      identifier: 'CRECI 83.933F',
      areaServed: 'São Leopoldo e região, RS',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'São Leopoldo',
        addressRegion: 'RS',
        addressCountry: 'BR',
      },
    },
  },
  {
    path: '/casas',
    outFile: 'casas/index.html',
    description:
      'Casas à venda em São Leopoldo e região, com curadoria da Schay Corretora. Espaço para a família viver com conforto, do quintal à sala de estar.',
  },
  {
    path: '/apartamentos',
    outFile: 'apartamentos/index.html',
    description:
      'Apartamentos à venda em São Leopoldo e região com a Schay Corretora. Praticidade e boa localização para o seu próximo endereço.',
  },
  {
    path: '/terrenos-e-oportunidades',
    outFile: 'terrenos-e-oportunidades/index.html',
    description:
      'Terrenos, sítios e oportunidades comerciais em São Leopoldo, Nova Petrópolis e região com a Schay Corretora.',
  },
]

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
}

function startStaticServer(rootDir, port) {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(req.url.split('?')[0])
      let filePath = path.join(rootDir, urlPath)
      let st = await stat(filePath).catch(() => null)
      if (st?.isDirectory()) {
        filePath = path.join(filePath, 'index.html')
        st = await stat(filePath).catch(() => null)
      }
      if (!st) {
        // Durante a GERAÇÃO ainda não existe dist/casas/index.html (é o que
        // este script está prestes a criar) — cair pro index.html deixa o
        // React Router assumir e navegar até a rota certa no cliente,
        // exatamente como um usuário real faria.
        filePath = path.join(rootDir, 'index.html')
      }
      const data = await readFile(filePath)
      res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' })
      res.end(data)
    } catch (err) {
      res.writeHead(500)
      res.end(String(err))
    }
  })
  return new Promise((resolve, reject) => {
    server.on('error', reject)
    server.listen(port, '127.0.0.1', () => resolve(server))
  })
}

async function scrollThroughPage(page) {
  // Dispara todo `whileInView` (Reveal) rolando a página inteira antes de
  // capturar o HTML — sem isso, o snapshot estático teria seções com
  // opacity:0 aplicado inline, e ficariam invisíveis pra sempre se o JS
  // não rodar depois (ver cabeçalho deste arquivo).
  //
  // Dois cuidados que fizeram diferença aqui:
  // 1. `behavior: 'instant'` explícito — o `scroll-behavior: smooth` global
  //    do site (index.css) faz um `scrollBy` comum virar uma animação de
  //    scroll que ainda está em andamento quando o próximo passo dispara,
  //    e isso deixava boa parte dos reveals presos a meio caminho da
  //    transição (opacity != 0 e != 1) no HTML capturado.
  // 2. Espera por passo maior que a duração das transições do Reveal
  //    (550ms) + o maior stagger usado no site, e uma checagem final de
  //    "assentou mesmo" (poll) em vez de confiar só num timeout fixo.
  await page.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms))
    const step = Math.round(window.innerHeight * 0.7)
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight

    for (let y = 0; y <= maxScroll; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await wait(750)
    }
    window.scrollTo({ top: maxScroll, behavior: 'instant' })
    await wait(750)

    // poll até nenhum elemento visível na página ter opacity intermediária
    // (ainda em transição), com um teto de segurança pra nunca travar.
    for (let attempt = 0; attempt < 20; attempt++) {
      const unsettled = Array.from(document.querySelectorAll('[style*="opacity"]')).filter((el) => {
        const op = parseFloat(window.getComputedStyle(el).opacity)
        return op > 0.001 && op < 0.98
      })
      if (unsettled.length === 0) break
      await wait(150)
    }

    window.scrollTo({ top: 0, behavior: 'instant' })
    await wait(200)
  })
}

async function injectHead(page, { canonical, description, jsonLd }) {
  await page.evaluate(
    ({ canonical, description, jsonLd, ogImage }) => {
      function upsertMeta(attr, value, content) {
        let el = document.querySelector(`meta[${attr}="${value}"]`)
        if (!el) {
          el = document.createElement('meta')
          el.setAttribute(attr, value)
          document.head.appendChild(el)
        }
        el.setAttribute('content', content)
      }
      function upsertLink(rel, href) {
        let el = document.querySelector(`link[rel="${rel}"]`)
        if (!el) {
          el = document.createElement('link')
          el.setAttribute('rel', rel)
          document.head.appendChild(el)
        }
        el.setAttribute('href', href)
      }

      upsertMeta('name', 'description', description)
      upsertLink('canonical', canonical)
      upsertMeta('property', 'og:title', document.title)
      upsertMeta('property', 'og:description', description)
      upsertMeta('property', 'og:url', canonical)
      upsertMeta('property', 'og:type', 'website')
      upsertMeta('property', 'og:image', ogImage)
      upsertMeta('property', 'og:locale', 'pt_BR')
      upsertMeta('name', 'twitter:card', 'summary_large_image')
      upsertMeta('name', 'twitter:title', document.title)
      upsertMeta('name', 'twitter:description', description)
      upsertMeta('name', 'twitter:image', ogImage)

      if (jsonLd) {
        let script = document.querySelector('script[type="application/ld+json"]')
        if (!script) {
          script = document.createElement('script')
          script.type = 'application/ld+json'
          document.head.appendChild(script)
        }
        script.textContent = JSON.stringify(jsonLd)
      }
    },
    { canonical, description, jsonLd, ogImage: OG_IMAGE },
  )
}

async function main() {
  if (!(await stat(DIST).catch(() => null))) {
    console.error('dist/ não existe — rode `vite build` antes deste script.')
    process.exit(1)
  }

  // Replica a estrutura real do GitHub Pages localmente: os assets são
  // referenciados a partir de `base` (ex: /schay-landing-page/assets/...),
  // então servimos um diretório pai cujo subcaminho `base` aponta pro dist.
  const stageRoot = path.join(ROOT, '.prerender-stage')
  await rm(stageRoot, { recursive: true, force: true })
  const stageTarget = path.join(stageRoot, base.replace(/^\/|\/$/g, ''))
  await mkdir(path.dirname(stageTarget), { recursive: true })
  await cp(DIST, stageTarget, { recursive: true })

  const port = 4319
  const server = await startStaticServer(stageRoot, port)
  const siteUrl = `http://127.0.0.1:${port}${base}`

  const launchOptions = process.env.PLAYWRIGHT_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
    : {}
  const browser = await chromium.launch(launchOptions)
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

  const pageErrors = []
  page.on('pageerror', (err) => pageErrors.push(String(err)))

  await page.goto(siteUrl, { waitUntil: 'networkidle' })

  for (const route of ROUTES) {
    if (route.path !== '/') {
      await page.evaluate((p) => {
        window.history.pushState({}, '', p)
        window.dispatchEvent(new PopStateEvent('popstate'))
      }, base.slice(0, -1) + route.path)
    }
    await page.waitForTimeout(250)
    await scrollThroughPage(page)
    await page.waitForTimeout(250)

    // Marca o HTML como pré-renderizado: Reveal.jsx e Hero.jsx leem esse
    // atributo pra pular a animação de entrada (hidden -> visible) no
    // primeiro mount do React nesta página. Sem isso, o React remonta a
    // árvore do zero por cima do HTML estático, esconde de novo o conteúdo
    // já visível (opacity:0) e só reanima depois — anulando o ganho do
    // prerender e piorando o LCP percebido (confirmado com medição real:
    // LCP do Hero foi de ~370ms pra ~9700ms em mobile throttled sem essa
    // marcação).
    await page.evaluate(() => document.documentElement.setAttribute('data-prerendered', 'true'))

    await injectHead(page, {
      canonical: `${PRODUCTION_URL}${route.path}`.replace(/\/$/, '') + (route.path === '/' ? '/' : ''),
      description: route.description,
      jsonLd: route.jsonLd,
    })

    const html = '<!doctype html>\n' + (await page.evaluate(() => document.documentElement.outerHTML))
    const outPath = path.join(DIST, route.outFile)
    await mkdir(path.dirname(outPath), { recursive: true })
    await writeFile(outPath, html, 'utf-8')
    console.log(`✓ ${route.path.padEnd(28)} -> dist/${route.outFile} (${(html.length / 1024).toFixed(0)} KB)`)
  }

  if (pageErrors.length) {
    console.error('\nErros de JS durante a pré-renderização:')
    for (const err of pageErrors) console.error(' -', err)
  }

  await browser.close()
  await server.close()
  await rm(stageRoot, { recursive: true, force: true })

  if (pageErrors.length) process.exit(1)
}

main().catch((err) => {
  console.error('Falha na pré-renderização:', err)
  process.exit(1)
})
