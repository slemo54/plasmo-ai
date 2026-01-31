import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Plasmo AI - Crea Video Cinematografici con l\'Intelligenza Artificiale',
  description: 'Genera video professionali e cinematografici in pochi click con l\'AI. Testo, immagini o riferimenti: Plasmo AI trasforma le tue idee in video mozzafiato.',
  keywords: ['video AI', 'generazione video', 'AI video', 'cinematografico', 'video editing AI', 'Plasmo AI'],
  openGraph: {
    title: 'Plasmo AI - Crea Video con l\'Intelligenza Artificiale',
    description: 'Genera video professionali e cinematografici in pochi click con l\'AI.',
    type: 'website',
    locale: 'it_IT',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className="dark">
      <body className="font-sans antialiased bg-[#090a0f] text-white">
        {children}
      </body>
    </html>
  )
}
