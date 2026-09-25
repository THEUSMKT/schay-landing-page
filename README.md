# Schay Corretora — Landing Page

Landing page da Schay Corretora (São Leopoldo/RS), com vitrine de imóveis,
histórias de vendas realizadas e formulário de contato. As 3 categorias de
imóveis (Apartamentos, Casas, Terrenos e oportunidades) têm páginas internas
próprias, acessadas com uma transição suave a partir dos cards da Home.

## Stack

- **React 19 + Vite** — build simples, gera arquivos estáticos (`dist/`) que
  rodam em qualquer host de site estático.
- **React Router** — rotas `/`, `/apartamentos`, `/casas`,
  `/terrenos-e-oportunidades`.
- **Framer Motion** — transição suave entre páginas e animação de entrada
  dos títulos ao rolar a página.
- **Tailwind CSS v4** — estilos, com a paleta e tipografia do site definidas
  como tokens em `src/index.css`.
- **lucide-react** — ícones.

Não há backend: o formulário de contato monta uma mensagem e abre o
WhatsApp da Schay já com o texto preenchido (ver seção "Formulário de
contato" abaixo).

## Rodando o projeto

```bash
npm install
npm run dev       # ambiente de desenvolvimento em http://localhost:5173
npm run build     # gera a versão de produção em dist/
npm run preview   # serve a versão de produção localmente, pra conferir
npm run lint      # checagem de código (oxlint)
```

## Estrutura do projeto

```
src/
  data/
    properties.js   # ▶ imóveis e categorias — ver "Editando imóveis" abaixo
    site.js          # dados institucionais (WhatsApp, e-mail, CRECI, menu)
    stories.js        # cards da seção "Histórias reais"
  components/        # peças reutilizáveis (Header, Footer, PropertyCard...)
  sections/          # seções da Home (Hero, Vitrine, Formulário...)
  pages/             # Home.jsx e CategoryPage.jsx (rotas)
  App.jsx            # rotas + transição entre páginas
```

## Editando os imóveis

Todo o conteúdo dos imóveis (os 3 cards da Home e as 3 páginas de
categoria) vem de **um único arquivo**: `src/data/properties.js`. Não é
preciso mexer em nenhum componente visual para atualizar um imóvel.

`PROPERTIES` só contém imóveis reais — categoria sem nenhum imóvel mostra
um estado vazio com convite para o WhatsApp, nunca cards inventados. Para
publicar um imóvel real, siga o passo a passo no comentário do topo de
`src/data/properties.js`. Em resumo:

1. Converta a foto de capa para `.webp` em `src/assets/images/imoveis/` e
   importe-a no topo de `src/data/properties.js`.
2. Adicione um objeto no fim da categoria certa em `PROPERTIES`, com `id`
   único, `code` (código Innovar), `title`, `neighborhood`, `city`,
   `price` (número, usado pela busca) e `priceLabel` (texto exibido).
3. Características: casas usam `areaM2` + `areaType` + `bedroomsLabel`;
   outros tipos usam os campos opcionais `typeLabel`, `areas`,
   `bedrooms`/`suites`, `rooms`, `bathrooms`, `parkingSpaces`,
   `frontM`/`backM` — o card mostra só o que for informado.

A página da categoria e a busca da Home são atualizadas automaticamente.

## Imagens de placeholder

Como o site ainda não tem fotos reais (do hero, da corretora, dos imóveis
e das vendas realizadas), todas as "fotos" hoje são ilustrações geradas em
CSS/SVG (gradiente + ícone), deixando isso claro visualmente — nunca
fingem ser uma foto de verdade. Troque por fotos reais quando tiver:

- **Imóveis:** ver item 4 acima.
- **Hero e retrato da corretora:** `src/sections/Hero.jsx`.
- **Fotos de "Histórias reais":** `src/sections/RealStories.jsx` e
  `src/data/stories.js`.

## Formulário de contato

O formulário (`src/sections/ContactForm.jsx`) não usa backend: ao enviar,
ele valida os campos obrigatórios (Nome, WhatsApp e Interesse) e abre o
WhatsApp da Schay em uma nova aba, com uma mensagem já formatada com os
dados preenchidos. Isso mantém o site 100% estático (fácil de hospedar em
qualquer lugar) e usa o canal que a imobiliária já usa no dia a dia.

Se no futuro for necessário capturar os leads também por e-mail ou em uma
planilha/CRM, dá pra trocar a função `handleSubmit` por uma chamada a um
serviço de formulários (Netlify Forms, Formspree, EmailJS etc.) sem mexer
no restante do site.

## Deploy

O projeto já sai pronto para os hosts estáticos mais comuns — o build
(`npm run build`) gera arquivos 100% estáticos em `dist/`:

- **Netlify:** `netlify.toml` já configurado (build `npm run build`,
  publish `dist`, com a regra de redirect para as rotas funcionarem).
- **Vercel:** `vercel.json` já configurado com o rewrite equivalente.
- **Outro host estático** (Cloudflare Pages, GitHub Pages, S3 etc.):
  configure o servidor para responder qualquer rota com `index.html`
  (SPA fallback) — sem isso, recarregar a página em `/apartamentos`, por
  exemplo, resulta em 404. O arquivo `public/_redirects` já resolve isso
  automaticamente em qualquer host compatível com o formato Netlify
  (inclusive Cloudflare Pages).

## Dados institucionais

WhatsApp, e-mail, CRECI e os links do menu ficam centralizados em
`src/data/site.js`.
