import { useCallback, useRef, useState } from 'react'

// Abaixo disso o gesto do mouse conta como clique; acima, é arraste — e o
// clique que o navegador dispara ao soltar é descartado.
const DRAG_THRESHOLD_PX = 6

/**
 * Arraste com o mouse numa faixa de rolagem horizontal nativa (toque,
 * caneta e trackpad continuam com a rolagem do próprio navegador). A faixa
 * acompanha o mouse 1:1 e, ao soltar, `onRelease({ velocity })` decide onde
 * encaixar — `velocity` em px/ms (negativo = mouse indo pra esquerda, ou
 * seja, avançando), só diferente de zero se o mouse ainda estava em
 * movimento ao soltar.
 *
 * Durante o arraste o scroll-snap da faixa fica desligado (senão o
 * navegador puxa de volta a cada movimento); quem trata `onRelease` é
 * responsável por religá-lo ao terminar o encaixe.
 *
 * `onPress` roda em todo pointerdown (inclusive toque) — os carrosséis usam
 * pra interromper uma animação de navegação em andamento.
 */
export default function useDragScroll(trackRef, { onPress, onRelease }) {
  const dragRef = useRef(null)
  const suppressClickRef = useRef(false)
  const [dragging, setDragging] = useState(false)
  // Estável entre renders: pode entrar nas dependências de efeitos.
  const isDragging = useCallback(() => dragRef.current !== null, [])

  const onPointerDown = (event) => {
    onPress?.()
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    dragRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startScroll: trackRef.current.scrollLeft,
      lastX: event.clientX,
      lastT: event.timeStamp,
      velocity: 0,
      moved: false,
    }
  }

  const onPointerMove = (event) => {
    const drag = dragRef.current
    if (!drag || event.pointerId !== drag.id) return
    const el = trackRef.current
    const dx = event.clientX - drag.startX
    if (!drag.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD_PX) return
      drag.moved = true
      // Captura só a partir daqui: um clique simples continua chegando no link.
      el.setPointerCapture(event.pointerId)
      el.style.scrollSnapType = 'none'
      // Um arraste que começou em cima de texto da faixa não deixa seleção
      // pra trás (seleções em outros pontos da página ficam intactas).
      const selection = window.getSelection()
      if (selection && !selection.isCollapsed && el.contains(selection.anchorNode)) {
        selection.removeAllRanges()
      }
      setDragging(true)
    }
    el.scrollLeft = drag.startScroll - dx
    const dt = event.timeStamp - drag.lastT
    if (dt > 0) drag.velocity = 0.7 * ((event.clientX - drag.lastX) / dt) + 0.3 * drag.velocity
    drag.lastX = event.clientX
    drag.lastT = event.timeStamp
  }

  const endDrag = (event) => {
    const drag = dragRef.current
    if (!drag || event.pointerId !== drag.id) return
    dragRef.current = null
    if (!drag.moved) return

    setDragging(false)
    suppressClickRef.current = true
    setTimeout(() => {
      suppressClickRef.current = false
    }, 0)

    // Só vale como "arremesso" se o mouse ainda estava em movimento ao soltar.
    const velocity = event.timeStamp - drag.lastT < 80 ? drag.velocity : 0
    onRelease({ velocity })
  }

  const onClickCapture = (event) => {
    if (!suppressClickRef.current) return
    suppressClickRef.current = false
    event.preventDefault()
    event.stopPropagation()
  }

  return {
    dragging,
    isDragging,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onLostPointerCapture: endDrag,
      onClickCapture,
      // Sem o "fantasma" de arrastar link/imagem do navegador.
      onDragStart: (event) => event.preventDefault(),
    },
  }
}
