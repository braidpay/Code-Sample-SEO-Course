import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SEO Full Course 2025 by Sara Postma | BraidPay',
  description: 'Master SEO and never worry about marketing again. Learn everything from keyword research to technical SEO with our comprehensive course launching in Q4 2025.',
  openGraph: {
    title: 'SEO Full Course 2025 by Sara Postma | BraidPay',
    description: 'Master SEO and never worry about marketing again. Learn everything from keyword research to technical SEO with our comprehensive course launching in Q4 2025.',
    images: [
      {
        url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/maxresdefault-QPTGkyk8nW0pwxRfGN59ai8PINl7BY.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Full Course 2025',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Full Course 2025 by Sara Postma',
    description: 'Master SEO and never worry about marketing again.',
    images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/maxresdefault-QPTGkyk8nW0pwxRfGN59ai8PINl7BY.jpg'],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 