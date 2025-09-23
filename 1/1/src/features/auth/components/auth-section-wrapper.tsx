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
  CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { AuthSocials } from "@/features/auth/components/auth-socials"
import { getSocialProviders } from "@/features/auth/lib/config"

type MaxWidth = "sm" | "md" | "lg" | "xl" | "2xl"

interface AuthSectionWrapperProps extends ComponentProps<"div"> {
  title: string
  titleClassName?: string
  description?: string
  descriptionClassName?: string
  backButtonLabel: string
  backButtonHref: string
  hideSocial?: boolean
  contentClassName?: string
  fullscreenCenter?: boolean          // NEW: center vertically & horizontally
  maxWidth?: MaxWidth                 // NEW: dynamic width (default lg)
}

const widthMap: Record<MaxWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
}

export const AuthSectionWrapper: FC<AuthSectionWrapperProps> = ({
  title,
  titleClassName,
  description,
  descriptionClassName,
  children,
  backButtonLabel,
  backButtonHref,
  hideSocial = false,
  contentClassName,
  className,
  fullscreenCenter = false,
  maxWidth = "lg",
  ...rest
}) => {
  const socialProviders = hideSocial ? [] : getSocialProviders()

  return (
    <div
      className={cn(
        "px-4",
        fullscreenCenter && "min-h-screen flex items-center justify-center",
        className,
      )}
      {...rest}
    >
      <Card
        className={cn(
          "w-full overflow-x-hidden",
          widthMap[maxWidth],
          // small outer spacing to avoid edge collisions
          !fullscreenCenter && "mx-auto my-6",
        )}
      >
        <CardHeader>
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

        <CardContent
          className={cn("py-6 px-4 sm:px-6 space-y-6", contentClassName)}
        >
          {children}
        </CardContent>

        {!hideSocial && (
          <>
            <div className="my-2 flex w-auto items-center">
              <Separator className="flex-1" />
              <span className="text-muted-foreground/30 mx-2 font-black">
                OR
              </span>
              <Separator className="flex-1" />
            </div>
            <CardFooter className="flex flex-col items-center gap-4 pb-6">
              <Suspense fallback={<div>Loading social login options...</div>}>
                {socialProviders.map(({ provider }) => (
                  <AuthSocials key={provider} provider={provider} />
                ))}
              </Suspense>
              <Button
                variant="link"
                className="text-muted-foreground hover:text-primary transition-all duration-200"
                asChild
              >
                <Link href={backButtonHref}>{backButtonLabel}</Link>
              </Button>
            </CardFooter>
          </>
        )}

        {hideSocial && (
          <CardFooter className="flex justify-center pb-6 pt-2">
            <Button
              variant="link"
              className="text-muted-foreground hover:text-primary transition-all duration-200"
              asChild
            >
              <Link href={backButtonHref}>{backButtonLabel}</Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}