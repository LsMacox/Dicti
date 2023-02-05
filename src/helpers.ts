export function debounce(
  func: { apply: (arg0: any, arg1: any) => void },
  timeout = 300
) {
  let timer: number | undefined
  return (...args: any) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}
