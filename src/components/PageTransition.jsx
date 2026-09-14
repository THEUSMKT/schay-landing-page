import { motion } from 'framer-motion'

const variants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  },
}

/**
 * Envolve o conteúdo de cada rota para que a troca de página seja um
 * cross-fade suave (com leve deslocamento vertical) em vez de uma troca
 * seca — ver App.jsx (AnimatePresence mode="wait") e ScrollManager.
 */
export default function PageTransition({ children }) {
  return (
    <motion.main
      className="flex-1"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.main>
  )
}
