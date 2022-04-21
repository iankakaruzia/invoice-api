export function generateSlug() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let letters = ''

  const charactersLength = characters.length
  for (let i = 0; i < 2; i++) {
    letters += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  const numbers = Math.floor(1000 + Math.random() * 9000)
  return letters + numbers.toString()
}
