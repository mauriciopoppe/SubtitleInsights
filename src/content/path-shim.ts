export const join = (...args: string[]) => {
  return args
    .filter(arg => !!arg)
    .join('/')
    .replace(/\/+/g, '/')
}
