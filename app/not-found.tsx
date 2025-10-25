'use client'

import * as React from 'react'
import Link from 'next/link'
import { Home, Search, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const [easterEggFound, setEasterEggFound] = React.useState(false)
  const [clicks, setClicks] = React.useState(0)
  const [showSecret, setShowSecret] = React.useState(false)

  const handleLogoClick = () => {
    setClicks((prev) => prev + 1)

    if (clicks + 1 === 5) {
      setEasterEggFound(true)
      setTimeout(() => setShowSecret(true), 500)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-br from-background via-background to-primary/5 px-6">
      {/* Background Animation */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute left-[20%] top-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[128px] transition-all duration-1000 ${
            easterEggFound ? 'animate-pulse' : ''
          }`}
        />
        <div
          className={`absolute right-[20%] top-[50%] h-[400px] w-[400px] rounded-full bg-secondary/20 blur-[128px] transition-all duration-1000 ${
            easterEggFound ? 'animate-pulse' : ''
          }`}
        />
        <div
          className={`absolute bottom-[10%] left-[50%] h-[300px] w-[300px] rounded-full bg-accent/20 blur-[128px] transition-all duration-1000 ${
            easterEggFound ? 'animate-pulse' : ''
          }`}
        />
      </div>

      <div className="mx-auto max-w-2xl text-center">
        {/* 404 Number */}
        <div
          className={`mb-8 cursor-pointer select-none transition-all duration-500 ${
            easterEggFound ? 'scale-110' : 'hover:scale-105'
          }`}
          onClick={handleLogoClick}
        >
          <h1
            className={`text-[12rem] font-black leading-none transition-all duration-500 sm:text-[16rem] ${
              easterEggFound
                ? 'gradient-text animate-[shimmer_2s_linear_infinite]'
                : 'text-primary/20'
            }`}
          >
            404
          </h1>
        </div>

        {/* Main Message */}
        {!easterEggFound ? (
          <>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Oops! Page Not Found
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Looks like you&apos;ve ventured into uncharted territory. This page
              doesn&apos;t exist... yet!
            </p>
          </>
        ) : (
          <>
            <h2 className="gradient-text mb-4 animate-[slideInFromTop_0.5s_ease-out] text-4xl font-bold sm:text-5xl">
              🎉 You Found It! 🎉
            </h2>
            <p className="mb-8 animate-[slideInFromTop_0.7s_ease-out] text-xl text-muted-foreground">
              Congratulations! You discovered the{' '}
              <span className="gradient-text-pink font-bold">AWESOME</span> easter
              egg!
            </p>
          </>
        )}

        {/* Easter Egg Secret Message */}
        {showSecret && (
          <div className="mb-8 animate-[slideInFromTop_1s_ease-out] rounded-2xl border-2 border-primary/40 bg-linear-to-br from-primary/20 via-secondary/20 to-accent/20 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 animate-pulse text-accent" />
              <h3 className="gradient-text-gold text-2xl font-bold">
                Secret Message
              </h3>
              <Sparkles className="h-6 w-6 animate-pulse text-accent" />
            </div>
            <p className="text-lg leading-relaxed">
              <span className="gradient-text font-semibold">AWESOME</span> isn&apos;t
              just a word, it&apos;s a way of life! Keep exploring, keep learning,
              and stay awesome! 💜💗💛
            </p>
            <div className="mt-4 text-sm text-muted-foreground">
              Pro tip: You can press{' '}
              <kbd className="mx-1">⌘K</kbd> or <kbd>Ctrl+K</kbd> to search from
              anywhere!
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="btn-awesome group gap-2">
            <Link href="/">
              <Home className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/search">
              <Search className="h-5 w-5" />
              <span>Search Instead</span>
            </Link>
          </Button>
        </div>

        {/* Hint for Easter Egg */}
        {!easterEggFound && (
          <p className="mt-12 animate-pulse text-sm text-muted-foreground/50">
            Psst... try clicking the 404 😉
          </p>
        )}

        {/* Success Confetti Effect */}
        {easterEggFound && (
          <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute h-2 w-2 animate-[confetti_3s_ease-out_forwards] rounded-full"
                style={{
                  left: `${50 + Math.random() * 10 - 5}%`,
                  top: `${30 + Math.random() * 10 - 5}%`,
                  backgroundColor: [
                    '#DA22FF',
                    '#FF69B4',
                    '#FFD700',
                    '#9733EE',
                    '#FF1493',
                  ][Math.floor(Math.random() * 5)],
                  animationDelay: `${Math.random() * 0.5}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Inline Animations */}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes slideInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
