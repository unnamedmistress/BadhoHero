export const badhoTheme = {
  colors: {
    leafGreen: '#4caf50',
    sunflower: '#ffc107',
    skyBlue: '#2196f3',
    accentIndigo: '#303f9f',
    warmOrange: '#ff9800',
    textDark: '#333',
    background: '#f8d7e1'
  },
  gradients: {
    hero: 'linear-gradient(135deg, #4caf50, #2196f3)',
    victory: 'linear-gradient(45deg, #ffc107, #ff9800)'
  }
} as const

export type BadhoTheme = typeof badhoTheme
