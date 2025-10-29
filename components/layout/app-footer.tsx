import Link from 'next/link'
import { AwesomeIcon } from '@/components/ui/awesome-icon'

export function AppFooter() {
  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background p-1 shadow-md ring-1 ring-primary/10">
              <AwesomeIcon size={24} className="drop-shadow-sm" />
            </div>
            <div>
              <div className="gradient-text mb-1 text-xl font-bold">Awesome</div>
              <p className="text-xs text-muted-foreground">
                Built with 💜💗💛 and maximum awesomeness
              </p>
            </div>
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
