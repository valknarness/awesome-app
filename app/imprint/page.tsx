import Link from 'next/link'
import { ArrowLeft, Code, Heart, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Imprint | Awesome',
  description: 'Information about the Awesome project',
}

export default function ImprintPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        {/* Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="gradient-text">Imprint</h1>

          <p className="lead">
            Information about the Awesome web application and its development.
          </p>

          <h2>About This Project</h2>

          <p>
            Awesome is an independent, unofficial web application designed to provide a
            beautiful and efficient way to explore curated awesome lists from GitHub. It
            is built as a tribute to and extension of the amazing work done by the
            open-source community.
          </p>

          <h2>Project Information</h2>

          <h3>Purpose</h3>
          <p>
            This web application serves as a next-level, ground-breaking AAA interface
            for discovering and exploring awesome lists. Our goals include:
          </p>
          <ul>
            <li>Providing fast, full-text search across awesome lists</li>
            <li>Offering an intuitive, beautiful user interface</li>
            <li>Maintaining up-to-date content through automation</li>
            <li>Making awesome lists accessible to everyone</li>
            <li>Supporting the open-source community</li>
          </ul>

          <h3>Inspiration</h3>
          <p>
            This project is inspired by and builds upon the incredible{' '}
            <a
              href="https://github.com/sindresorhus/awesome"
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-text font-semibold"
            >
              sindresorhus/awesome
            </a>{' '}
            project and the entire awesome list ecosystem. We are grateful to all
            contributors who maintain these valuable curated lists.
          </p>

          <h2>Technology Stack</h2>

          <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border-2 border-primary/20 bg-card p-6">
              <div className="mb-2 flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Frontend</h3>
              </div>
              <ul className="space-y-1 text-sm">
                <li>Next.js 18</li>
                <li>TypeScript</li>
                <li>Tailwind CSS 4</li>
                <li>shadcn/ui</li>
                <li>Radix UI</li>
              </ul>
            </div>

            <div className="rounded-lg border-2 border-secondary/20 bg-card p-6">
              <div className="mb-2 flex items-center gap-2">
                <Code className="h-5 w-5 text-secondary" />
                <h3 className="text-lg font-semibold">Backend</h3>
              </div>
              <ul className="space-y-1 text-sm">
                <li>Node.js 22+</li>
                <li>SQLite3</li>
                <li>FTS5 Search</li>
                <li>GitHub API</li>
                <li>GitHub Actions</li>
              </ul>
            </div>
          </div>

          <h2>Features</h2>

          <ul>
            <li>
              <strong>Lightning-Fast Search:</strong> Powered by SQLite FTS5 for instant
              full-text search
            </li>
            <li>
              <strong>Always Fresh:</strong> Automated database updates every 6 hours via
              GitHub Actions
            </li>
            <li>
              <strong>Smart Updates:</strong> Service worker-based background updates with
              user notifications
            </li>
            <li>
              <strong>Beautiful UI:</strong> Carefully crafted design with purple/pink/gold
              theme
            </li>
            <li>
              <strong>PWA Ready:</strong> Install as an app on any device with offline
              support
            </li>
            <li>
              <strong>Keyboard Shortcuts:</strong> Efficient navigation with ⌘K / Ctrl+K
              command palette
            </li>
            <li>
              <strong>Dark Mode:</strong> Automatic theme switching based on system
              preferences
            </li>
            <li>
              <strong>Responsive:</strong> Works perfectly on desktop, tablet, and mobile
            </li>
          </ul>

          <h2>Data Sources</h2>

          <p>
            All content displayed on Awesome is sourced from public GitHub repositories.
            We use the GitHub API to fetch and aggregate information about awesome
            lists. The data includes:
          </p>
          <ul>
            <li>Repository metadata (name, description, stars, etc.)</li>
            <li>README content</li>
            <li>Topics and categories</li>
            <li>Last update timestamps</li>
          </ul>

          <h2>Attribution</h2>

          <h3>Original Awesome Project</h3>
          <p>
            The awesome list concept and curation standards are maintained by{' '}
            <a
              href="https://github.com/sindresorhus"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sindre Sorhus
            </a>{' '}
            and the amazing community of contributors.
          </p>

          <h3>Color Scheme</h3>
          <p>
            Our beautiful purple/pink/gold theme is inspired by and matches the colors
            used in the awesome CLI application, maintaining visual consistency across
            the awesome ecosystem.
          </p>

          <h3>Open Source Community</h3>
          <p>
            This project wouldn&apos;t be possible without the countless developers who
            contribute to open-source projects and maintain awesome lists. Thank you! 💜
          </p>

          <h2>Development</h2>

          <p className="flex items-center gap-2">
            <span>Built with</span>
            <Heart className="inline h-5 w-5 fill-secondary text-secondary" />
            <span>and maximum awesomeness by the community</span>
          </p>

          <div className="not-prose my-6">
            <Button asChild className="btn-awesome gap-2">
              <a
                href="https://github.com/sindresorhus/awesome"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
                <span>View Original Awesome Project</span>
              </a>
            </Button>
          </div>

          <h2>License</h2>

          <p>
            This web application is provided as-is for the benefit of the community. All
            displayed content retains its original licensing from the source
            repositories.
          </p>

          <h2>Contact & Contributions</h2>

          <p>
            We welcome feedback, bug reports, and contributions! If you&apos;d like to get
            involved:
          </p>
          <ul>
            <li>Report issues on our GitHub repository</li>
            <li>Suggest new features or improvements</li>
            <li>Contribute to the codebase</li>
            <li>Share the project with others</li>
          </ul>

          <hr />

          <p className="text-center text-muted-foreground">
            <span className="gradient-text text-xl font-bold">Stay Awesome!</span>
            <br />
            💜💗💛
          </p>

          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </article>
      </div>
    </div>
  )
}
