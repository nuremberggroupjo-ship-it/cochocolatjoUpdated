import * as React from "react"

interface EmailTemplateProps {
  email: string
  message: string
}

export function EmailTemplate({ email, message }: EmailTemplateProps) {
  return (
    <div>
      <h4>You have a new message:</h4>
      <p>
        <strong>Email:</strong> {email}
      </p>
      <p>
        <strong>Message:</strong> {message}
      </p>
    </div>
  )
}
