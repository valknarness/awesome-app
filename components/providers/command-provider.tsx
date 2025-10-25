'use client'

import * as React from 'react'
import { CommandMenu } from '@/components/layout/command-menu'

export function CommandProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      {children}
      <CommandMenu open={open} setOpen={setOpen} />
    </>
  )
}
