import type { Metadata } from 'next'
import { Inter } from 'next/font/google' // Or try other fonts like 'Poppins', 'Nunito'
import './globals.css'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Anime Scene Finder | Built by Masab Farooque',
  description: 'Find the anime, episode, and timestamp from any anime screenshot or video clip. Features meme generator. Powered by trace.moe API.',
  // Add keywords, open graph tags etc. for better SEO if desired
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* Add class for potential font override */}
      <body className={`${inter.className} min-h-screen flex flex-col bg-base`}>
        {/* Main content area */}
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
           {children}
        </main>
        {/* Footer */}
        <Footer />
      </body>
    </html>
  )
}