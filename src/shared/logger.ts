const VERBOSE = false

export function makeLogger(context: string) {
  return (...args) => VERBOSE && console.log(`[${context}]`, ...args)
}
