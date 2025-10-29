import Link from 'next/link'

export function AppFooter() {
  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm px-6 py-12 lg:px-8">
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
  )
}
