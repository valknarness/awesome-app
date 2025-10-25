'use client'

import * as React from 'react'
import { Moon, Sun, Palette, Check } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { colorPalettes, type ColorPalette } from '@/lib/themes'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [selectedPalette, setSelectedPalette] = React.useState('awesome')
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    // Load saved palette from localStorage
    const savedPalette = localStorage.getItem('color-palette')
    if (savedPalette) {
      setSelectedPalette(savedPalette)
      applyPalette(colorPalettes.find(p => p.id === savedPalette) || colorPalettes[0])
    }
  }, [])

  const applyPalette = (palette: ColorPalette) => {
    const root = document.documentElement

    // Apply CSS custom properties
    root.style.setProperty('--color-primary', palette.colors.primary)
    root.style.setProperty('--color-primary-light', palette.colors.primaryLight)
    root.style.setProperty('--color-primary-dark', palette.colors.primaryDark)

    root.style.setProperty('--color-secondary', palette.colors.secondary)
    root.style.setProperty('--color-secondary-light', palette.colors.secondaryLight)
    root.style.setProperty('--color-secondary-dark', palette.colors.secondaryDark)

    root.style.setProperty('--color-accent', palette.colors.accent)
    root.style.setProperty('--color-accent-light', palette.colors.accentLight)
    root.style.setProperty('--color-accent-dark', palette.colors.accentDark)

    root.style.setProperty('--gradient-awesome', palette.gradient)

    // Update awesome-specific colors
    root.style.setProperty('--awesome-purple', palette.colors.primary)
    root.style.setProperty('--awesome-pink', palette.colors.secondary)
    root.style.setProperty('--awesome-gold', palette.colors.accent)

    // Save to localStorage
    localStorage.setItem('color-palette', palette.id)
    setSelectedPalette(palette.id)
  }

  const handlePaletteChange = (palette: ColorPalette) => {
    applyPalette(palette)
  }

  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-10 w-10 rounded-full border-2 border-primary/20 bg-background/80 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary/5"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-awesome opacity-10" />
          {isDark ? (
            <Moon className="h-5 w-5 text-primary" />
          ) : (
            <Sun className="h-5 w-5 text-primary" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[320px] border-2 border-primary/20 bg-background/95 backdrop-blur-xl"
      >
        <DropdownMenuLabel className="flex items-center gap-2 text-base">
          <Palette className="h-5 w-5 text-primary" />
          <span className="gradient-text font-bold">Theme Settings</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-primary/20" />

        {/* Mode Selection */}
        <div className="px-2 py-3">
          <div className="mb-2 text-xs font-semibold text-muted-foreground">
            MODE
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={!isDark ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('light')}
              className={!isDark ? 'btn-awesome' : ''}
            >
              <Sun className="mr-2 h-4 w-4" />
              Light
            </Button>
            <Button
              variant={isDark ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('dark')}
              className={isDark ? 'btn-awesome' : ''}
            >
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-primary/20" />

        {/* Palette Selection */}
        <div className="px-2 py-3">
          <div className="mb-3 text-xs font-semibold text-muted-foreground">
            COLOR PALETTE
          </div>
          <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
            {colorPalettes.map((palette) => (
              <button
                key={palette.id}
                onClick={() => handlePaletteChange(palette)}
                className={`group relative w-full rounded-lg border-2 p-3 text-left transition-all hover:border-primary/40 hover:bg-primary/5 ${
                  selectedPalette === palette.id
                    ? 'border-primary/60 bg-primary/10'
                    : 'border-border/40'
                }`}
              >
                {/* Color Preview */}
                <div className="mb-2 flex gap-1.5">
                  <div
                    className="h-6 w-6 rounded-md ring-1 ring-black/10"
                    style={{ background: palette.colors.primary }}
                  />
                  <div
                    className="h-6 w-6 rounded-md ring-1 ring-black/10"
                    style={{ background: palette.colors.secondary }}
                  />
                  <div
                    className="h-6 w-6 rounded-md ring-1 ring-black/10"
                    style={{ background: palette.colors.accent }}
                  />
                  {selectedPalette === palette.id && (
                    <div className="ml-auto flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Palette Info */}
                <div className="font-semibold text-foreground">
                  {palette.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {palette.description}
                </div>

                {/* Gradient Preview */}
                <div
                  className="mt-2 h-1.5 rounded-full"
                  style={{ background: palette.gradient }}
                />
              </button>
            ))}
          </div>
        </div>

        <DropdownMenuSeparator className="bg-primary/20" />

        {/* Footer */}
        <div className="px-4 py-2 text-center text-xs text-muted-foreground">
          Choose your awesome style! 💜💗💛
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
