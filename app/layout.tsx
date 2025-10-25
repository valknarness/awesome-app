import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'highlight.js/styles/github-dark.css'
import { Toaster } from '@/components/ui/sonner'
import { WorkerProvider } from '@/components/providers/worker-provider'
import { CommandProvider } from '@/components/providers/command-provider'
import { AppHeader } from '@/components/layout/app-header'
import { ThemeProvider } from 'next-themes'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#DA22FF',
}

export const metadata: Metadata = {
  title: 'Awesome - Curated Lists Explorer',
  description: 'Next-level ground-breaking AAA webapp for exploring awesome lists from GitHub',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Awesome',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' }
    ],
    apple: '/apple-touch-icon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://awesome.example.com',
    siteName: 'Awesome',
    title: 'Awesome - Curated Lists Explorer',
    description: 'Explore and discover curated awesome lists from GitHub',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Awesome',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Awesome - Curated Lists Explorer',
    description: 'Explore and discover curated awesome lists from GitHub',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WorkerProvider>
            <CommandProvider>
              <AppHeader />
              {children}
            </CommandProvider>
          </WorkerProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
