import * as React from 'react'
import { cn } from '@/lib/utils'

interface AwesomeIconProps {
  className?: string
  size?: number
}

export function AwesomeIcon({ className, size = 24 }: AwesomeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={cn('awesome-icon', className)}
      aria-label="Awesome Logo"
    >
      {/* Main structure */}
      <path
        className="fill-(--color-primary-dark)"
        d="m39.4 23l-.8-4L26 21.6V8h-4v12.3l-13.9-9l-2.2 3.4l15.2 9.8L9.4 39.8l3.2 2.4l11.3-14.8l8.4 12.7l3.4-2.2l-8.4-12.5z"
      />

      {/* Center circle */}
      <circle
        cx="24"
        cy="24"
        r="7"
        className="fill-secondary"
      />

      {/* Outer circles - themed */}
      <circle
        cx="24"
        cy="8"
        r="5"
        className="fill-primary"
      />
      <circle
        cx="39"
        cy="21"
        r="5"
        className="fill-secondary"
      />
      <circle
        cx="7"
        cy="13"
        r="5"
        className="fill-(--color-primary-dark)"
      />
      <circle
        cx="11"
        cy="41"
        r="5"
        className="fill-(--color-secondary-dark)"
      />
      <circle
        cx="34"
        cy="39"
        r="5"
        className="fill-(--color-primary-light)"
      />
    </svg>
  )
}
