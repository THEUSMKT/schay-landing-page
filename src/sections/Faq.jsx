import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import Reveal from '../components/Reveal'
import SectionEyebrow from '../components/SectionEyebrow'
import { SITE } from '../data/site'

// Só perguntas sobre COMO o atendimento funciona — nada sobre condições
// comerciais (prazos de resposta, comissão, financiamento etc.) que não
// estejam confirmadas.
const FAQ_ITEMS = [
  {
    question: 'Como funciona o primeiro contato?',
    answer:
      'Você fala diretamente com a Schay pelo WhatsApp, conta o que procura e ela organiza os próximos passos com você — sem formulário obrigatório nem espera em fila.',
  },
  {
    question: 'A Schay atende só em São Leopoldo?',
    answer: `A atuação é em ${SITE.region}. Conte a cidade ou bairro do seu interesse e ela confirma se consegue te ajudar por lá.`,
  },
  {
    question: 'Preciso me cadastrar para ver os imóveis?',
    answer:
      'Não. Você pode navegar pelo site e usar a busca livremente, sem informar dados antes — o contato só acontece quando você decidir falar pelo WhatsApp.',
  },
  {
    question: 'O site mostra todos os imóveis disponíveis?',
    answer:
      'Mostramos apenas imóveis já conferidos pela Schay. Se você não encontrar o que procura na vitrine, ela pode buscar outras opções fora do site conforme o seu perfil.',
  },
  {
    question: 'Como acompanho a negociação de um imóvel?',
    answer:
      'O acompanhamento acontece direto com a Schay pelo WhatsApp, do interesse inicial até a entrega das chaves.',
  },
]

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  return (
    <section id="duvidas-frequentes" className="scroll-mt-24 bg-paper-100 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal className="flex justify-center">
          <SectionEyebrow tone="dark">Dúvidas frequentes</SectionEyebrow>
        </Reveal>
        <Reveal
          as="h2"
          delay={0.08}
          className="mt-4 text-center font-display text-4xl font-semibold text-navy-950 sm:text-5xl"
        >
          Perguntas sobre o atendimento.
        </Reveal>

        <div className="mt-12 flex flex-col gap-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index
            const panelId = `faq-panel-${index}`
            const buttonId = `faq-button-${index}`

            return (
              <Reveal
                key={item.question}
                delay={0.06 * index}
                className="overflow-hidden rounded-2xl border border-navy-950/10 bg-paper-50"
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-navy-950 sm:text-base"
                  >
                    {item.question}
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-accent-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm text-navy-600 sm:text-base">{item.answer}</p>
                </motion.div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
