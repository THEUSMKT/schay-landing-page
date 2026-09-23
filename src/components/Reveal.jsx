import { motion, useReducedMotion } from 'framer-motion'

const TAGS = {
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
  li: motion.li,
  ul: motion.ul,
  form: motion.form,
}

/**
 * Anima a entrada de um bloco (fade-in + leve deslocamento vertical).
 *
 * - mode="inView" (padrão): dispara quando o elemento entra na viewport ao
 *   rolar a página — usado nos títulos de seção abaixo da dobra.
 * - mode="mount": dispara assim que o componente monta — usado no hero,
 *   que já está visível no carregamento da página.
 *
 * Padrão de referência do site: deslocamento 12-24px, duração 400-700ms,
 * stagger de 60-120ms entre itens de um mesmo grupo (via `delay`). Quando
 * o visitante prefere menos movimento (prefers-reduced-motion), o
 * conteúdo aparece direto, sem deslocamento nem fade.
 */
export default function Reveal({
  as = 'div',
  children,
  className,
  delay = 0,
  duration = 0.55,
  y = 16,
  once = true,
  amount = 0.3,
  mode = 'inView',
  ...rest
}) {
  const Component = TAGS[as] || motion.div
  const reduceMotion = useReducedMotion()

  const variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration, delay, ease: [0.22, 1, 0.36, 1] },
        },
      }

  const triggerProps =
    mode === 'mount'
      ? { initial: 'hidden', animate: 'visible' }
      : {
          initial: 'hidden',
          whileInView: 'visible',
          viewport: { once, amount },
        }

  return (
    <Component className={className} variants={variants} {...triggerProps} {...rest}>
      {children}
    </Component>
  )
}
