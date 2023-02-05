export default {
  methods: {
    attachPosition(
      target: HTMLElement | undefined,
      relative: HTMLElement,
      indent: { left: number; top: number }
    ) {
      if (!target) return

      target.style["position"] = "absolute"

      const relativeDOMRect: DOMRect = relative.getBoundingClientRect()

      const top = relativeDOMRect.top + window.pageYOffset + indent.top
      const left = relativeDOMRect.left + indent.left

      target.style["top"] = top + "px"
      target.style["left"] = left + "px"
    },
  },
}
