import Link from "next/link"
import { ComponentProps, FC, Suspense } from "react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { AuthSocials } from "@/features/auth/components/auth-socials"
import { getSocialProviders } from "@/features/auth/lib/config"

interface AuthSectionWrapperProps extends ComponentProps<"section"> {
  title: string
  titleClassName?: string
  description?: string
  descriptionClassName?: string
  backButtonLabel: string
  backButtonHref: string
}

export const AuthSectionWrapper: FC<AuthSectionWrapperProps> = ({
  title,
  titleClassName,
  description,
  descriptionClassName,
  children,
  backButtonLabel,
  backButtonHref,
}) => {
  // Get all social providers from config
  const socialProviders = getSocialProviders()

  return (
    <Card className="mx-auto max-w-lg overflow-x-hidden">
      {/* Card Header */}
      <CardHeader className="">
        <CardTitle
          className={cn(
            "text-center text-xl font-semibold tracking-wider uppercase md:text-2xl",
            titleClassName,
          )}
        >
          {title}
        </CardTitle>
        {description && (
          <CardDescription
            className={cn(
              "text-center tracking-wide md:text-base",
              descriptionClassName,
            )}
          >
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <Separator />

      {children}

      {/* Card Footer */}
      <div className="my-2 flex w-auto items-center">
        <Separator className="flex-1" />
        <span className="text-muted-foreground/30 mx-2 font-black">OR</span>
        <Separator className="flex-1" />
      </div>
      <CardFooter className="flex flex-col items-center gap-4">
        <Suspense fallback={<div>Loading social login options...</div>}>
          {socialProviders.map(({ provider }) => (
            <AuthSocials key={provider} provider={provider} />
          ))}
        </Suspense>
        <Button
          variant="link"
          className="text-muted-foreground hover:text-primary transition-all duration-200"
        >
          <Link href={backButtonHref}>{backButtonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
