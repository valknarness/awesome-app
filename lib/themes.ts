export interface ColorPalette {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    primaryLight: string
    primaryDark: string
    secondary: string
    secondaryLight: string
    secondaryDark: string
    accent: string
    accentLight: string
    accentDark: string
  }
  gradient: string
}

export const colorPalettes: ColorPalette[] = [
  {
    id: 'awesome',
    name: 'Awesome Purple',
    description: 'Our signature purple, pink, and gold theme',
    colors: {
      primary: '#DA22FF',
      primaryLight: '#E855FF',
      primaryDark: '#9733EE',
      secondary: '#FF69B4',
      secondaryLight: '#FFB6D9',
      secondaryDark: '#FF1493',
      accent: '#FFD700',
      accentLight: '#FFE44D',
      accentDark: '#FFC700',
    },
    gradient: 'linear-gradient(135deg, #DA22FF 0%, #9733EE 50%, #FFD700 100%)',
  },
  {
    id: 'royal',
    name: 'Royal Violet',
    description: 'Deep purple with regal blue and silver accents',
    colors: {
      primary: '#7C3AED',
      primaryLight: '#A78BFA',
      primaryDark: '#5B21B6',
      secondary: '#6366F1',
      secondaryLight: '#818CF8',
      secondaryDark: '#4F46E5',
      accent: '#94A3B8',
      accentLight: '#CBD5E1',
      accentDark: '#64748B',
    },
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 50%, #94A3B8 100%)',
  },
  {
    id: 'cosmic',
    name: 'Cosmic Purple',
    description: 'Deep space purple with cyan and magenta',
    colors: {
      primary: '#8B5CF6',
      primaryLight: '#A78BFA',
      primaryDark: '#6D28D9',
      secondary: '#EC4899',
      secondaryLight: '#F472B6',
      secondaryDark: '#DB2777',
      accent: '#06B6D4',
      accentLight: '#22D3EE',
      accentDark: '#0891B2',
    },
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #06B6D4 100%)',
  },
  {
    id: 'sunset',
    name: 'Purple Sunset',
    description: 'Warm purple with orange and coral tones',
    colors: {
      primary: '#A855F7',
      primaryLight: '#C084FC',
      primaryDark: '#7E22CE',
      secondary: '#F97316',
      secondaryLight: '#FB923C',
      secondaryDark: '#EA580C',
      accent: '#FB7185',
      accentLight: '#FDA4AF',
      accentDark: '#F43F5E',
    },
    gradient: 'linear-gradient(135deg, #A855F7 0%, #F97316 50%, #FB7185 100%)',
  },
  {
    id: 'lavender',
    name: 'Lavender Dreams',
    description: 'Soft purple with pastel pink and mint',
    colors: {
      primary: '#C084FC',
      primaryLight: '#D8B4FE',
      primaryDark: '#A855F7',
      secondary: '#F9A8D4',
      secondaryLight: '#FBC8E7',
      secondaryDark: '#F472B6',
      accent: '#86EFAC',
      accentLight: '#BBF7D0',
      accentDark: '#4ADE80',
    },
    gradient: 'linear-gradient(135deg, #C084FC 0%, #F9A8D4 50%, #86EFAC 100%)',
  },
  {
    id: 'neon',
    name: 'Neon Purple',
    description: 'Electric purple with bright neon accents',
    colors: {
      primary: '#D946EF',
      primaryLight: '#E879F9',
      primaryDark: '#C026D3',
      secondary: '#F0ABFC',
      secondaryLight: '#F5D0FE',
      secondaryDark: '#E879F9',
      accent: '#22D3EE',
      accentLight: '#67E8F9',
      accentDark: '#06B6D4',
    },
    gradient: 'linear-gradient(135deg, #D946EF 0%, #F0ABFC 50%, #22D3EE 100%)',
  },
  {
    id: 'galaxy',
    name: 'Galaxy Purple',
    description: 'Deep cosmic purple with star-like shimmer',
    colors: {
      primary: '#6D28D9',
      primaryLight: '#8B5CF6',
      primaryDark: '#5B21B6',
      secondary: '#7C3AED',
      secondaryLight: '#A78BFA',
      secondaryDark: '#6D28D9',
      accent: '#FBBF24',
      accentLight: '#FCD34D',
      accentDark: '#F59E0B',
    },
    gradient: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #FBBF24 100%)',
  },
  {
    id: 'berry',
    name: 'Berry Blast',
    description: 'Rich purple with berry and wine tones',
    colors: {
      primary: '#9333EA',
      primaryLight: '#A855F7',
      primaryDark: '#7E22CE',
      secondary: '#BE123C',
      secondaryLight: '#E11D48',
      secondaryDark: '#9F1239',
      accent: '#FB923C',
      accentLight: '#FDBA74',
      accentDark: '#F97316',
    },
    gradient: 'linear-gradient(135deg, #9333EA 0%, #BE123C 50%, #FB923C 100%)',
  },
]

export type ThemeMode = 'light' | 'dark'

export interface ThemeConfig {
  mode: ThemeMode
  palette: string
}

export function getThemeVariables(palette: ColorPalette, mode: ThemeMode) {
  const isDark = mode === 'dark'

  return {
    // Base colors
    background: isDark ? '0 0% 3.9%' : '0 0% 100%',
    foreground: isDark ? '0 0% 98%' : '0 0% 3.9%',

    // Card
    card: isDark ? '0 0% 3.9%' : '0 0% 100%',
    cardForeground: isDark ? '0 0% 98%' : '0 0% 3.9%',

    // Popover
    popover: isDark ? '0 0% 3.9%' : '0 0% 100%',
    popoverForeground: isDark ? '0 0% 98%' : '0 0% 3.9%',

    // Primary (from palette)
    primary: palette.colors.primary,
    primaryLight: palette.colors.primaryLight,
    primaryDark: palette.colors.primaryDark,
    primaryForeground: isDark ? '0 0% 9%' : '0 0% 98%',

    // Secondary (from palette)
    secondary: palette.colors.secondary,
    secondaryLight: palette.colors.secondaryLight,
    secondaryDark: palette.colors.secondaryDark,
    secondaryForeground: isDark ? '0 0% 98%' : '0 0% 9%',

    // Accent (from palette)
    accent: palette.colors.accent,
    accentLight: palette.colors.accentLight,
    accentDark: palette.colors.accentDark,
    accentForeground: isDark ? '0 0% 98%' : '0 0% 9%',

    // Muted
    muted: isDark ? '0 0% 14.9%' : '0 0% 96.1%',
    mutedForeground: isDark ? '0 0% 63.9%' : '0 0% 45.1%',

    // Destructive
    destructive: isDark ? '0 62.8% 30.6%' : '0 84.2% 60.2%',
    destructiveForeground: '0 0% 98%',

    // Border
    border: isDark ? '0 0% 14.9%' : '0 0% 89.8%',
    input: isDark ? '0 0% 14.9%' : '0 0% 89.8%',
    ring: palette.colors.primary,

    // Gradient
    gradient: palette.gradient,
  }
}

export function hexToHsl(hex: string): string {
  // Remove the hash if present
  hex = hex.replace(/^#/, '')

  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  h = Math.round(h * 360)
  s = Math.round(s * 100)
  const lightness = Math.round(l * 100)

  return `${h} ${s}% ${lightness}%`
}
