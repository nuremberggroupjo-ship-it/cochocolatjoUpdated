import { Metadata } from "next"

import { PAGE_METADATA, createMetadata } from "@/constants"

export const metadata: Metadata = createMetadata(PAGE_METADATA.privacy)

export default function PrivacyPage() {
  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-b">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="from-primary to-primary/70 mb-4 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-lg">
            Your privacy matters to us. Here&apos;s how we protect your
            information.
          </p>
          <div className="from-primary to-primary/50 mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r" />
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Information Collection */}
          <div className="bg-card rounded-xl border p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
                <div className="bg-primary h-4 w-4 rounded-full" />
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-semibold">
                  Information We Collect
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We only collect the necessary information to authenticate you
                  via Facebook login, including your name and email address.
                  This minimal approach ensures we respect your privacy while
                  providing you with a seamless shopping experience.
                </p>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="bg-card rounded-xl border p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                <div className="h-4 w-4 rounded-full bg-green-500" />
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-semibold">
                  How We Protect Your Data
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not share your personal data with third parties. Your
                  information is securely stored and used solely for account
                  authentication and order processing. We implement
                  industry-standard security measures to protect your privacy.
                </p>
              </div>
            </div>
          </div>

          {/* Data Deletion */}
          <div className="bg-card rounded-xl border p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                <div className="h-4 w-4 rounded-full bg-red-500" />
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-semibold">
                  Data Deletion Rights
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  You have the right to request deletion of your account and
                  associated data at any time.
                </p>
                <div className="bg-muted/50 rounded-lg border-l-4 border-red-500 p-4">
                  <p className="mb-2 text-sm font-medium">
                    To delete your data:
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Email us at{" "}
                    <a
                      href="mailto:support@yourdomain.com"
                      className="text-primary font-medium hover:underline"
                    >
                      support@yourdomain.com
                    </a>{" "}
                    with the subject <strong>&quot;Delete My Data&quot;</strong>{" "}
                    from the email address you used to sign in.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="from-primary/5 to-primary/10 border-primary/20 rounded-xl border bg-gradient-to-r p-8">
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-semibold">
                Questions or Concerns?
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                If you have any questions about this Privacy Policy or need
                assistance with your data, we&apos;re here to help.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="mailto:support@yourdomain.com"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Contact Support
                </a>

                <div className="text-muted-foreground text-sm">
                  support@yourdomain.com
                </div>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="border-t pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
