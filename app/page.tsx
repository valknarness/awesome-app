import Link from 'next/link'
import { ArrowRight, Search, Star, Sparkles, Zap, Shield, Heart } from 'lucide-react'
import { getStats } from '@/lib/db'
import { AwesomeIcon } from '@/components/ui/awesome-icon'

export default function Home() {
  const stats = getStats()
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
        {/* Background Gradient Orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[20%] top-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[128px]" />
          <div className="absolute right-[20%] top-[40%] h-[400px] w-[400px] rounded-full bg-secondary/20 blur-[128px]" />
          <div className="absolute bottom-0 left-[50%] h-[300px] w-[300px] rounded-full bg-accent/20 blur-[128px]" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
            <AwesomeIcon size={16} />
            <span>Explore {stats.totalLists}+ Curated Lists</span>
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl">
            <span className="gradient-text">Awesome</span>
            <br />
            <span className="text-foreground">Discovery Made Simple</span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Your gateway to the world&apos;s most{' '}
            <span className="gradient-text-pink font-semibold">curated collections</span>.
            Lightning-fast search, beautiful interface, and always up-to-date.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/search"
              className="btn-awesome group inline-flex items-center gap-2 px-8 py-4 text-lg"
            >
              <Search className="h-5 w-5" />
              <span>Start Exploring</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/browse"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-primary/20 bg-background/80 px-8 py-4 text-lg font-semibold text-foreground backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary/5"
            >
              <Star className="h-5 w-5" />
              <span>Browse Collections</span>
            </Link>
          </div>

          {/* Quick Search Hint */}
          <p className="mt-8 text-sm text-muted-foreground">
            Pro tip: Press{' '}
            <kbd className="mx-1">⌘</kbd>
            <kbd>K</kbd>
            {' '}or{' '}
            <kbd className="mx-1">Ctrl</kbd>
            <kbd>K</kbd>
            {' '}to search from anywhere
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Why <span className="gradient-text">Awesome</span>?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Built with cutting-edge technology to deliver the best experience
            </p>
          </div>

          {/* SVG Gradient Definitions */}
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'var(--color-primary)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'var(--color-primary-dark)', stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="gradient-secondary" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'var(--color-secondary)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'var(--color-secondary-dark)', stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="gradient-accent" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'var(--color-accent)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'var(--color-accent-dark)', stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="gradient-awesome" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'var(--color-primary)', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: 'var(--color-secondary)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'var(--color-accent)', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="card-awesome group rounded-xl bg-card p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 shadow-lg ring-1 ring-primary/10 transition-all group-hover:ring-primary/30 group-hover:shadow-xl group-hover:shadow-primary/20">
                <Zap className="h-6 w-6 icon-gradient-awesome" strokeWidth={2} />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Powered by SQLite FTS5 for instant full-text search across thousands of repositories
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-awesome group rounded-xl bg-card p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 shadow-lg ring-1 ring-primary/10 transition-all group-hover:ring-primary/30 group-hover:shadow-xl group-hover:shadow-primary/20">
                <Sparkles className="h-6 w-6 icon-gradient-awesome" strokeWidth={2} />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Always Fresh</h3>
              <p className="text-muted-foreground">
                Automated updates every 6 hours via GitHub Actions. Never miss a new awesome list
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-awesome group rounded-xl bg-card p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 shadow-lg ring-1 ring-primary/10 transition-all group-hover:ring-primary/30 group-hover:shadow-xl group-hover:shadow-primary/20">
                <Search className="h-6 w-6 icon-gradient-awesome" strokeWidth={2} />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Smart Search</h3>
              <p className="text-muted-foreground">
                Faceted filtering by language, stars, topics. Find exactly what you need
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card-awesome group rounded-xl bg-card p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 shadow-lg ring-1 ring-primary/10 transition-all group-hover:ring-primary/30 group-hover:shadow-xl group-hover:shadow-primary/20">
                <Heart className="h-6 w-6 icon-gradient-awesome" strokeWidth={2} />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Beautiful UI</h3>
              <p className="text-muted-foreground">
                Stunning purple/pink/gold theme with smooth animations and responsive design
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card-awesome group rounded-xl bg-card p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 shadow-lg ring-1 ring-primary/10 transition-all group-hover:ring-primary/30 group-hover:shadow-xl group-hover:shadow-primary/20">
                <Shield className="h-6 w-6 icon-gradient-awesome" strokeWidth={2} />
              </div>
              <h3 className="mb-3 text-xl font-semibold">PWA Ready</h3>
              <p className="text-muted-foreground">
                Install as an app on any device. Works offline with service worker support
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card-awesome group rounded-xl bg-card p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 shadow-lg ring-1 ring-primary/10 transition-all group-hover:ring-primary/30 group-hover:shadow-xl group-hover:shadow-primary/20">
                <Star className="h-6 w-6 icon-gradient-awesome" strokeWidth={2} />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Curated Quality</h3>
              <p className="text-muted-foreground">
                Only the best lists from the awesome ecosystem. Quality over quantity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border-2 border-primary/20 bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 p-12 backdrop-blur-sm">
            <div className="grid gap-8 text-center md:grid-cols-3">
              <div>
                <div className="gradient-text mb-2 text-5xl font-bold">{stats.totalLists.toLocaleString()}</div>
                <div className="text-lg text-muted-foreground">Curated Lists</div>
              </div>
              <div>
                <div className="gradient-text-pink mb-2 text-5xl font-bold">{(stats.totalRepositories / 1000).toFixed(0)}K+</div>
                <div className="text-lg text-muted-foreground">Repositories</div>
              </div>
              <div>
                <div className="gradient-text-gold mb-2 text-5xl font-bold">6hr</div>
                <div className="text-lg text-muted-foreground">Update Cycle</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold">
            Ready to discover{' '}
            <span className="gradient-text">awesome</span> things?
          </h2>
          <p className="mb-12 text-lg text-muted-foreground">
            Join thousands of developers exploring the best curated content
          </p>
          <Link
            href="/search"
            className="btn-awesome group inline-flex items-center gap-2 px-8 py-4 text-lg"
          >
            <Search className="h-5 w-5" />
            <span>Start Your Journey</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-center sm:text-left">
              <div className="gradient-text mb-2 text-xl font-bold">Awesome</div>
              <p className="text-sm text-muted-foreground">
                Built with 💜💗💛 and maximum awesomeness
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/legal" className="text-muted-foreground hover:text-primary">
                Legal
              </Link>
              <Link href="/disclaimer" className="text-muted-foreground hover:text-primary">
                Disclaimer
              </Link>
              <Link href="/imprint" className="text-muted-foreground hover:text-primary">
                Imprint
              </Link>
              <a
                href="https://github.com/sindresorhus/awesome"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
