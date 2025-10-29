import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'highlight.js/styles/github-dark.css'
import { Toaster } from '@/components/ui/sonner'
import { WorkerProvider } from '@/components/providers/worker-provider'
import { CommandProvider } from '@/components/providers/command-provider'
import { AppHeader } from '@/components/layout/app-header'
import { AppFooter } from '@/components/layout/app-footer'
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
    ],
    apple: '/apple-touch-icon.png',
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const defaultPalette = {
                    primary: '#DA22FF',
                    primaryLight: '#E855FF',
                    primaryDark: '#9733EE',
                    secondary: '#FF69B4',
                    secondaryLight: '#FFB6D9',
                    secondaryDark: '#FF1493',
                    accent: '#FFD700',
                    accentLight: '#FFE44D',
                    accentDark: '#FFC700',
                    gradient: 'linear-gradient(135deg, #DA22FF 0%, #9733EE 50%, #FFD700 100%)'
                  };

                  const palettes = {
                    awesome: defaultPalette,
                    royal: {
                      primary: '#7C3AED',
                      primaryLight: '#A78BFA',
                      primaryDark: '#5B21B6',
                      secondary: '#6366F1',
                      secondaryLight: '#818CF8',
                      secondaryDark: '#4F46E5',
                      accent: '#94A3B8',
                      accentLight: '#CBD5E1',
                      accentDark: '#64748B',
                      gradient: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 50%, #94A3B8 100%)'
                    },
                    cosmic: {
                      primary: '#8B5CF6',
                      primaryLight: '#A78BFA',
                      primaryDark: '#6D28D9',
                      secondary: '#EC4899',
                      secondaryLight: '#F472B6',
                      secondaryDark: '#DB2777',
                      accent: '#06B6D4',
                      accentLight: '#22D3EE',
                      accentDark: '#0891B2',
                      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #06B6D4 100%)'
                    },
                    sunset: {
                      primary: '#A855F7',
                      primaryLight: '#C084FC',
                      primaryDark: '#7E22CE',
                      secondary: '#F97316',
                      secondaryLight: '#FB923C',
                      secondaryDark: '#EA580C',
                      accent: '#FB7185',
                      accentLight: '#FDA4AF',
                      accentDark: '#F43F5E',
                      gradient: 'linear-gradient(135deg, #A855F7 0%, #F97316 50%, #FB7185 100%)'
                    },
                    lavender: {
                      primary: '#C084FC',
                      primaryLight: '#D8B4FE',
                      primaryDark: '#A855F7',
                      secondary: '#F9A8D4',
                      secondaryLight: '#FBC8E7',
                      secondaryDark: '#F472B6',
                      accent: '#86EFAC',
                      accentLight: '#BBF7D0',
                      accentDark: '#4ADE80',
                      gradient: 'linear-gradient(135deg, #C084FC 0%, #F9A8D4 50%, #86EFAC 100%)'
                    },
                    neon: {
                      primary: '#D946EF',
                      primaryLight: '#E879F9',
                      primaryDark: '#C026D3',
                      secondary: '#F0ABFC',
                      secondaryLight: '#F5D0FE',
                      secondaryDark: '#E879F9',
                      accent: '#22D3EE',
                      accentLight: '#67E8F9',
                      accentDark: '#06B6D4',
                      gradient: 'linear-gradient(135deg, #D946EF 0%, #F0ABFC 50%, #22D3EE 100%)'
                    },
                    galaxy: {
                      primary: '#6D28D9',
                      primaryLight: '#8B5CF6',
                      primaryDark: '#5B21B6',
                      secondary: '#7C3AED',
                      secondaryLight: '#A78BFA',
                      secondaryDark: '#6D28D9',
                      accent: '#FBBF24',
                      accentLight: '#FCD34D',
                      accentDark: '#F59E0B',
                      gradient: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #FBBF24 100%)'
                    },
                    berry: {
                      primary: '#9333EA',
                      primaryLight: '#A855F7',
                      primaryDark: '#7E22CE',
                      secondary: '#BE123C',
                      secondaryLight: '#E11D48',
                      secondaryDark: '#9F1239',
                      accent: '#FB923C',
                      accentLight: '#FDBA74',
                      accentDark: '#F97316',
                      gradient: 'linear-gradient(135deg, #9333EA 0%, #BE123C 50%, #FB923C 100%)'
                    }
                  };

                  const savedPaletteId = localStorage.getItem('color-palette') || 'awesome';
                  const palette = palettes[savedPaletteId] || defaultPalette;
                  const root = document.documentElement;

                  root.style.setProperty('--color-primary', palette.primary);
                  root.style.setProperty('--color-primary-light', palette.primaryLight);
                  root.style.setProperty('--color-primary-dark', palette.primaryDark);
                  root.style.setProperty('--color-secondary', palette.secondary);
                  root.style.setProperty('--color-secondary-light', palette.secondaryLight);
                  root.style.setProperty('--color-secondary-dark', palette.secondaryDark);
                  root.style.setProperty('--color-accent', palette.accent);
                  root.style.setProperty('--color-accent-light', palette.accentLight);
                  root.style.setProperty('--color-accent-dark', palette.accentDark);
                  root.style.setProperty('--gradient-awesome', palette.gradient);
                  root.style.setProperty('--awesome-purple', palette.primary);
                  root.style.setProperty('--awesome-pink', palette.secondary);
                  root.style.setProperty('--awesome-gold', palette.accent);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WorkerProvider>
            <CommandProvider>
              <div className="flex min-h-screen flex-col">
                <AppHeader />
                <main className="flex-1">{children}</main>
                <AppFooter />
              </div>
            </CommandProvider>
          </WorkerProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
