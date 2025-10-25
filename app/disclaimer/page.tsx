import Link from 'next/link'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Disclaimer | Awesome',
  description: 'Important disclaimers and information',
}

export default function DisclaimerPage() {
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
          <div className="mb-6 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-accent" />
            <h1 className="gradient-text mb-0">Disclaimer</h1>
          </div>

          <p className="lead">
            Important information about using Awesome and the content displayed on this
            platform.
          </p>

          <h2>General Disclaimer</h2>

          <p>
            The information provided by Awesome (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is for general
            informational purposes only. All information on the site is provided in good
            faith, however we make no representation or warranty of any kind, express or
            implied, regarding the accuracy, adequacy, validity, reliability,
            availability, or completeness of any information on the site.
          </p>

          <h2>Third-Party Content</h2>

          <h3>Aggregated Information</h3>
          <p>
            Awesome displays content aggregated from various GitHub repositories,
            primarily from the{' '}
            <a
              href="https://github.com/sindresorhus/awesome"
              target="_blank"
              rel="noopener noreferrer"
            >
              sindresorhus/awesome
            </a>{' '}
            project and related awesome lists. We are not the authors or maintainers of
            these lists.
          </p>

          <h3>Content Accuracy</h3>
          <p>
            While we strive to keep the information up to date and correct through
            automated updates every 6 hours, we make no guarantees about:
          </p>
          <ul>
            <li>The accuracy of repository information</li>
            <li>The availability of linked resources</li>
            <li>The quality or security of listed projects</li>
            <li>The current maintenance status of repositories</li>
            <li>The licensing terms of listed projects</li>
          </ul>

          <h3>No Endorsement</h3>
          <p>
            The inclusion of any repository, project, or resource on Awesome does not
            constitute an endorsement, recommendation, or approval by us. We do not
            verify the quality, security, or reliability of any listed content.
          </p>

          <h2>External Links</h2>

          <p>
            Awesome contains links to external websites and resources. These links are
            provided solely for your convenience. We have no control over:
          </p>
          <ul>
            <li>The content of linked websites</li>
            <li>The privacy practices of external sites</li>
            <li>The availability of external resources</li>
            <li>The security of third-party platforms</li>
          </ul>

          <p>
            We are not responsible for any content, products, services, or other
            materials available on or through these external links.
          </p>

          <h2>Professional Disclaimer</h2>

          <h3>No Professional Advice</h3>
          <p>
            The content on Awesome is not intended to be a substitute for professional
            advice. Always seek the advice of qualified professionals with any questions
            you may have regarding:
          </p>
          <ul>
            <li>Software development decisions</li>
            <li>Security implementations</li>
            <li>Technology choices</li>
            <li>License compatibility</li>
            <li>Production deployments</li>
          </ul>

          <h3>Security Considerations</h3>
          <p>
            Before using any software or tool listed on Awesome, you should:
          </p>
          <ul>
            <li>Review the source code and documentation</li>
            <li>Check for known security vulnerabilities</li>
            <li>Verify the license terms</li>
            <li>Assess the maintenance status</li>
            <li>Test thoroughly in a safe environment</li>
          </ul>

          <h2>Availability and Updates</h2>

          <h3>Service Availability</h3>
          <p>
            We do not guarantee that Awesome will be available at all times. Technical
            issues, maintenance, or other factors may cause temporary unavailability.
          </p>

          <h3>Data Currency</h3>
          <p>
            While our database updates every 6 hours via GitHub Actions, there may be
            delays or gaps in updates due to:
          </p>
          <ul>
            <li>GitHub API rate limits</li>
            <li>Build failures</li>
            <li>Network issues</li>
            <li>Service interruptions</li>
          </ul>

          <h2>Limitation of Liability</h2>

          <p>
            Under no circumstances shall Awesome, its operators, contributors, or
            affiliates be liable for any direct, indirect, incidental, consequential, or
            special damages arising out of or in any way connected with your use of this
            service, including but not limited to:
          </p>
          <ul>
            <li>Use of any listed software or tools</li>
            <li>Reliance on information provided</li>
            <li>Security incidents or vulnerabilities</li>
            <li>Data loss or corruption</li>
            <li>Business interruption</li>
            <li>Loss of profits or revenue</li>
          </ul>

          <h2>User Responsibility</h2>

          <p>As a user of Awesome, you acknowledge and agree that:</p>
          <ul>
            <li>You use this service at your own risk</li>
            <li>
              You are responsible for evaluating the suitability of any listed content
            </li>
            <li>
              You will verify information before making important decisions
            </li>
            <li>You will respect the licenses and terms of listed projects</li>
            <li>
              You understand that information may be outdated or incomplete
            </li>
          </ul>

          <h2>Changes to This Disclaimer</h2>

          <p>
            We reserve the right to modify this disclaimer at any time. Changes will be
            effective immediately upon posting to this page. Your continued use of
            Awesome following any changes constitutes acceptance of those changes.
          </p>

          <h2>Contact</h2>

          <p>
            If you have any questions or concerns about this disclaimer, please open an
            issue on our GitHub repository.
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
