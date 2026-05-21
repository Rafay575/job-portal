import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        `
        w-full min-w-0 h-9 rounded-md
        bg-transparent px-3 py-1
        text-base md:text-sm
        outline-none shadow-xs
        transition-all duration-200


        focus:border-primary
        focus:border-2

        focus-visible:border-primary
        focus-visible:border-2



        placeholder:text-muted-foreground

        disabled:pointer-events-none
        disabled:cursor-not-allowed
        disabled:opacity-50

        aria-invalid:border-destructive
        `,
        className
      )}
      {...props}
    />
  )
}

export { Input }