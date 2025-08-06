<<<<<<< HEAD:group66_8/src/components/ui/avatar.tsx
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"
=======
"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";
>>>>>>> feat/add-header-and-footer-components:src/components/ui/avatar.tsx

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
<<<<<<< HEAD:group66_8/src/components/ui/avatar.tsx
  )
=======
  );
>>>>>>> feat/add-header-and-footer-components:src/components/ui/avatar.tsx
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
<<<<<<< HEAD:group66_8/src/components/ui/avatar.tsx
  )
=======
  );
>>>>>>> feat/add-header-and-footer-components:src/components/ui/avatar.tsx
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
<<<<<<< HEAD:group66_8/src/components/ui/avatar.tsx
  )
}

export { Avatar, AvatarImage, AvatarFallback }
=======
  );
}

export { Avatar, AvatarImage, AvatarFallback };
>>>>>>> feat/add-header-and-footer-components:src/components/ui/avatar.tsx
