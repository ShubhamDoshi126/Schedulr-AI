import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Intelligent Calendar',
  description: 'A smart calendar app with NLP and image processing capabilities',
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
