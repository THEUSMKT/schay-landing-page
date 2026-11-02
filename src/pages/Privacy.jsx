import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Reveal from "../components/Reveal";
import SectionEyebrow from "../components/SectionEyebrow";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { SITE } from "../data/site";

// Data da última revisão do texto — atualize sempre que a política mudar.
const UPDATED_AT = "2 de novembro de 2026";

/** Marca o que ainda precisa ser confirmado com a corretora antes de valer. */
function ToConfirm({ children }) {
  return (
    <>
      <span className="rounded bg-amber-300/50 px-1.5 py-0.5 text-sm font-bold text-amber-800">
        A CONFIRMAR
      </span>
      {children ? <> {children}</> : null}
    </>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="font-display text-2xl font-semibold text-navy-950">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-navy-700">{children}</div>
    </section>
  );
}

const List = ({ children }) => (
  <ul className="list-disc space-y-2 pl-5 marker:text-amber-600">{children}</ul>
);

const ExternalLink = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="font-medium text-accent-700 underline underline-offset-2 hover:text-accent-600"
  >
    {children}
  </a>
);

/**
 * Política de Privacidade (/politica-de-privacidade). Descreve só o que o
 * site faz de fato — questionário (src/pages/LeadQuiz.jsx), planilha do
 * Google (src/lib/lead.js), origem da visita (src/lib/attribution.js), tag
 * do Google Ads (index.html) e botões de WhatsApp. O que depende da
 * corretora fica marcado com <ToConfirm />.
 */
export default function Privacy() {
  useDocumentTitle("Política de Privacidade | Schay Corretora");
  const email = (
    <a
      href={`mailto:${SITE.email}`}
      className="font-medium text-accent-700 underline underline-offset-2 hover:text-accent-600"
    >
      {SITE.email}
    </a>
  );

  return (
    <>
      <section className="bg-linear-to-b from-paper-200 from-55% to-paper-100 pt-14 pb-12 sm:pt-20 sm:pb-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal mode="mount">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-navy-600 transition-colors duration-200 hover:text-accent-600"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Voltar para a página inicial
            </Link>
          </Reveal>
          <Reveal mode="mount" delay={0.08} className="mt-6">
            <SectionEyebrow tone="dark">Privacidade</SectionEyebrow>
          </Reveal>
          <Reveal
            as="h1"
            mode="mount"
            delay={0.14}
            className="mt-4 font-display text-4xl font-semibold text-balance text-navy-950 sm:text-5xl"
          >
            Política de Privacidade
          </Reveal>
          <Reveal mode="mount" delay={0.2} className="mt-4 text-navy-600">
            Aqui você vê, em linguagem simples, quais dados o site da {SITE.name} coleta,
            para que usa, onde guarda e como você pode controlá-los, conforme a Lei Geral
            de Proteção de Dados (LGPD, Lei nº 13.709/2018).
          </Reveal>
          <p className="mt-4 text-sm text-navy-500">Última atualização: {UPDATED_AT}.</p>
        </div>
      </section>

      <div className="bg-paper-100 pb-20 sm:pb-28">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Section title="1. Quem somos">
            <p>
              Este site é da <strong>{SITE.name}</strong>, de <strong>Schay Cardoso</strong>,
              corretora de imóveis (CRECI {SITE.creci}) em {SITE.city}/{SITE.state}. Ela é a
              responsável pelas decisões sobre o uso dos seus dados pessoais (a
              “controladora”, na LGPD).
            </p>
            <List>
              <li>E-mail: {email}</li>
              <li>WhatsApp: {SITE.whatsappDisplay}</li>
            </List>
          </Section>

          <Section title="2. Quais dados coletamos">
            <p>
              <strong>No questionário “Encontrar imóveis ideais para meu perfil”</strong> (página
              /minha-busca), somente se você o preencher e enviar:
            </p>
            <List>
              <li>seu nome e seu WhatsApp;</li>
              <li>
                suas respostas: objetivo (morar, investir ou pesquisar), tipo de imóvel,
                cidade (e bairro, se informar), faixa de orçamento, forma de pagamento e
                prazo para comprar;
              </li>
              <li>
                a data do envio e a origem da sua visita — por exemplo, se você chegou por
                um anúncio do Google, por outro site ou direto — com o nome da campanha,
                quando houver.
              </li>
            </List>
            <p>
              <strong>Classificação interna.</strong> Com base nas respostas, o próprio site
              calcula uma pontuação simples e classifica o seu interesse como quente, morno
              ou frio. Isso serve apenas para organizar o atendimento; você não vê essa
              classificação.
            </p>
            <p>
              <strong>Busca, formulário “Vamos conversar” e botões de WhatsApp.</strong> A
              busca de imóveis da página inicial funciona no seu próprio aparelho e não envia
              nada. O formulário do fim da página e os botões de WhatsApp abrem o WhatsApp
              com uma mensagem já escrita; ela só chega à Schay se você a enviar por lá.
            </p>
            <p>
              <strong>Dados de navegação.</strong> Ao abrir o site, a tag de anúncios do
              Google e a hospedagem recebem dados técnicos, como endereço IP, tipo de
              aparelho e navegador e páginas visitadas (veja os itens 5 e 6).
            </p>
          </Section>

          <Section title="3. Para que usamos">
            <List>
              <li>entrar em contato com você pelo WhatsApp sobre imóveis;</li>
              <li>
                enviar opções de imóveis que combinem com o seu perfil e organizar o
                atendimento;
              </li>
              <li>
                medir se os anúncios da Schay estão trazendo contatos (quantos questionários
                foram enviados e quantos cliques no WhatsApp houve).
              </li>
            </List>
            <p>
              <strong>Base legal.</strong> Para o questionário, o seu consentimento: a caixa
              de autorização que você marca antes de enviar. Para a medição de anúncios:{" "}
              <ToConfirm />
            </p>
          </Section>

          <Section title="4. Onde ficam guardados">
            <p>
              Os dados do questionário ficam em uma planilha do Google (Google Planilhas),
              na conta Google da {SITE.name}. O Google pode armazenar e processar esses
              dados em servidores fora do Brasil.
            </p>
            <p>
              Por quanto tempo guardamos os dados: <ToConfirm />
            </p>
          </Section>

          <Section title="5. Com quem compartilhamos">
            <List>
              <li>
                <strong>Google</strong> — pelo Google Planilhas, que guarda as respostas do
                questionário, e pela tag do Google Ads, que mede os anúncios. A tag recebe
                dados de navegação e o registro de que houve um contato (um questionário
                enviado ou um clique no WhatsApp). O site <strong>não</strong> envia seu nome,
                seu WhatsApp nem suas respostas à tag de anúncios.
              </li>
              <li>
                <strong>WhatsApp (Meta)</strong> — quando você clica em um botão de WhatsApp
                ou envia a mensagem, a conversa acontece no WhatsApp e segue os termos e a
                política de privacidade dele.
              </li>
              <li>
                <strong>Hospedagem do site (GitHub Pages)</strong> — pode registrar dados
                técnicos de acesso, como o endereço IP de quem visita.
              </li>
            </List>
            <p>
              Pelo site, seus dados não são enviados a mais ninguém além dos citados acima.
              Mais detalhes na{" "}
              <ExternalLink href="https://policies.google.com/privacy?hl=pt-BR">
                política de privacidade do Google
              </ExternalLink>
              .
            </p>
          </Section>

          <Section title="6. Cookies e tag de anúncios">
            <List>
              <li>
                <strong>Tag do Google Ads.</strong> Ela é carregada quando você abre
                qualquer página do site e pode gravar cookies do Google no seu navegador,
                para medir se um anúncio levou a um contato. Veja como o Google usa cookies{" "}
                <ExternalLink href="https://policies.google.com/technologies/cookies?hl=pt-BR">
                  aqui
                </ExternalLink>
                .
              </li>
              <li>
                <strong>Origem da visita.</strong> Guardamos na sessão do seu navegador de
                onde você veio (por exemplo, anúncio do Google). Isso é apagado quando você
                fecha o navegador e só vai para a planilha se você enviar o questionário.
              </li>
              <li>
                <strong>Aviso de cookies.</strong> Guardamos no seu navegador apenas a
                informação de que você já fechou o aviso, para não mostrá-lo de novo.
              </li>
            </List>
            <p>
              Hoje o aviso de cookies é informativo: a tag é carregada ao abrir o site. Você
              pode bloquear ou apagar cookies nas configurações do seu navegador e ajustar a
              personalização de anúncios em{" "}
              <ExternalLink href="https://adssettings.google.com">
                adssettings.google.com
              </ExternalLink>
              .
            </p>
          </Section>

          <Section title="7. Seus direitos">
            <p>Pela LGPD, você pode pedir à Schay, a qualquer momento:</p>
            <List>
              <li>a confirmação de que tratamos dados seus e o acesso a eles;</li>
              <li>a correção de dados incompletos, errados ou desatualizados;</li>
              <li>
                a anonimização, o bloqueio ou a eliminação de dados desnecessários ou
                tratados fora da lei;
              </li>
              <li>a eliminação dos dados que tratamos com base no seu consentimento;</li>
              <li>informações sobre com quem os dados são compartilhados;</li>
              <li>a portabilidade dos dados;</li>
              <li>
                a revogação do consentimento e a revisão da classificação do seu interesse
                (item 2).
              </li>
            </List>
            <p>
              <strong>Como pedir:</strong> envie um e-mail para {email} ou uma mensagem para
              o WhatsApp {SITE.whatsappDisplay}, dizendo o que você deseja. A resposta vem
              pelo mesmo canal. Se achar que seus dados foram tratados de forma
              inadequada, você também pode reclamar à Autoridade Nacional de Proteção de
              Dados (ANPD), em{" "}
              <ExternalLink href="https://www.gov.br/anpd">gov.br/anpd</ExternalLink>.
            </p>
          </Section>

          <Section title="8. Dúvidas e contato">
            <p>
              Para qualquer dúvida sobre esta política ou sobre os seus dados, fale com a
              Schay pelo e-mail {email} ou pelo WhatsApp {SITE.whatsappDisplay}.
            </p>
            <p>
              Encarregado pelo tratamento de dados (DPO): <ToConfirm />
            </p>
          </Section>

          <Section title="9. Mudanças nesta política">
            <p>
              Podemos atualizar esta política quando o site mudar. A data no topo da página
              mostra a última revisão.
            </p>
          </Section>
        </div>
      </div>
    </>
  );
}
