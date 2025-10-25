import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Legal | Awesome',
  description: 'Legal information and terms of use',
}

export default function LegalPage() {
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
          <h1 className="gradient-text">Legal Information</h1>

          <p className="lead">
            Welcome to Awesome. This page outlines the legal terms and conditions for
            using our service.
          </p>

          <h2>Terms of Use</h2>

          <h3>Acceptance of Terms</h3>
          <p>
            By accessing and using Awesome, you accept and agree to be bound by the
            terms and provision of this agreement. If you do not agree to these terms,
            please do not use our service.
          </p>

          <h3>Use License</h3>
          <p>
            Permission is granted to temporarily access the materials (information or
            software) on Awesome for personal, non-commercial transitory viewing only.
            This is the grant of a license, not a transfer of title, and under this
            license you may not:
          </p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>
              Attempt to decompile or reverse engineer any software contained on Awesome
            </li>
            <li>
              Remove any copyright or other proprietary notations from the materials
            </li>
            <li>
              Transfer the materials to another person or &quot;mirror&quot; the materials on
              any other server
            </li>
          </ul>

          <h2>Content and Attribution</h2>

          <h3>Third-Party Content</h3>
          <p>
            Awesome aggregates and displays content from GitHub repositories, primarily
            from the{' '}
            <a
              href="https://github.com/sindresorhus/awesome"
              target="_blank"
              rel="noopener noreferrer"
            >
              Awesome
            </a>{' '}
            project and related lists. We do not claim ownership of any third-party
            content displayed on this site.
          </p>

          <h3>GitHub API</h3>
          <p>
            This service uses the GitHub API to fetch repository information. All data
            is subject to GitHub&apos;s terms of service and API usage policies.
          </p>

          <h3>Attribution</h3>
          <p>
            All content maintains attribution to the original authors and repositories.
            Links to original sources are provided throughout the application.
          </p>

          <h2>Data Collection and Privacy</h2>

          <h3>Personal Data</h3>
          <p>
            Awesome does not collect, store, or process personal data. We do not use
            cookies for tracking purposes. The service operates entirely client-side
            with data fetched from our public database.
          </p>

          <h3>Service Workers</h3>
          <p>
            We use service workers to enable offline functionality and improve
            performance. These are stored locally in your browser and can be cleared at
            any time.
          </p>

          <h2>Intellectual Property</h2>

          <h3>Awesome Branding</h3>
          <p>
            The &quot;Awesome&quot; name and logo are derived from the original{' '}
            <a
              href="https://github.com/sindresorhus/awesome"
              target="_blank"
              rel="noopener noreferrer"
            >
              sindresorhus/awesome
            </a>{' '}
            project. This web application is an independent, unofficial viewer for
            awesome lists.
          </p>

          <h3>Open Source</h3>
          <p>
            This project respects and builds upon the open-source community. All
            displayed content is from public repositories and is subject to their
            respective licenses.
          </p>

          <h2>Disclaimers</h2>

          <h3>No Warranty</h3>
          <p>
            The materials on Awesome are provided on an &apos;as is&apos; basis. Awesome makes no
            warranties, expressed or implied, and hereby disclaims and negates all other
            warranties including, without limitation, implied warranties or conditions
            of merchantability, fitness for a particular purpose, or non-infringement of
            intellectual property or other violation of rights.
          </p>

          <h3>Limitations</h3>
          <p>
            In no event shall Awesome or its suppliers be liable for any damages
            (including, without limitation, damages for loss of data or profit, or due
            to business interruption) arising out of the use or inability to use the
            materials on Awesome.
          </p>

          <h2>Links to Third-Party Sites</h2>
          <p>
            Awesome contains links to third-party websites. These links are provided for
            your convenience. We have no control over the content of those sites and
            accept no responsibility for them or for any loss or damage that may arise
            from your use of them.
          </p>

          <h2>Modifications</h2>
          <p>
            Awesome may revise these terms of service at any time without notice. By
            using this website, you are agreeing to be bound by the then current version
            of these terms of service.
          </p>

          <h2>Contact</h2>
          <p>
            If you have any questions about these legal terms, please open an issue on
            our GitHub repository.
          </p>

          <hr />

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
