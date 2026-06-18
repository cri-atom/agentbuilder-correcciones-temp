import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'Atom — Evaluaciones',
  description: 'Atom Agent Builder - Evaluaciones',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
