'use client'

import * as React from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { GripVerticalIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SlidingPanelContextType {
  panelWidth: number
  setPanelWidth: (width: number) => void
  motionPanelWidth: ReturnType<typeof useMotionValue<number>>
  isPanelOpen: boolean
  closePanel: () => void
}

const SlidingPanelContext = React.createContext<SlidingPanelContextType | undefined>(undefined)

const useSlidingPanel = () => {
  const context = React.useContext(SlidingPanelContext)
  if (!context) {
    throw new Error('useSlidingPanel must be used within a SlidingPanel')
  }
  return context
}

export interface SlidingPanelProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
  className?: string
}

export function SlidingPanel({
  children,
  isOpen,
  onClose,
  defaultWidth = 50,
  minWidth = 30,
  maxWidth = 70,
  className,
}: SlidingPanelProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const motionValue = useMotionValue(defaultWidth)
  const motionPanelWidth = useSpring(motionValue, {
    bounce: 0,
    duration: isDragging ? 0 : 300,
  })
  const [panelWidth, setPanelWidth] = React.useState(defaultWidth)

  // Calculate resizer position - must be called unconditionally
  const resizerLeft = useTransform(motionPanelWidth, (value) => `${value}%`)

  const handleDrag = (domRect: DOMRect, clientX: number) => {
    if (!isDragging) return

    const x = clientX - domRect.left
    const percentage = Math.min(
      Math.max((x / domRect.width) * 100, minWidth),
      maxWidth
    )
    motionValue.set(percentage)
    setPanelWidth(percentage)
  }

  const handleMouseDrag = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!event.currentTarget) return
    const containerRect = event.currentTarget.getBoundingClientRect()
    handleDrag(containerRect, event.clientX)
  }

  const handleTouchDrag = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!event.currentTarget) return
    const containerRect = event.currentTarget.getBoundingClientRect()
    const touch = event.touches[0]
    if (touch) {
      handleDrag(containerRect, touch.clientX)
    }
  }

  return (
    <SlidingPanelContext.Provider
      value={{
        panelWidth,
        setPanelWidth,
        motionPanelWidth,
        isPanelOpen: isOpen,
        closePanel: onClose,
      }}
    >
      <div
        className={cn(
          'relative w-full',
          isDragging && 'select-none',
          className
        )}
        onMouseMove={handleMouseDrag}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchMove={handleTouchDrag}
        onTouchEnd={() => setIsDragging(false)}
      >
        {children}

        {/* Resizer Handle */}
        {isOpen && (
          <motion.div
            className={cn(
              'absolute top-0 z-50 flex h-full w-1 items-center justify-center bg-primary/10 transition-colors hover:bg-primary/30',
              isDragging && 'bg-primary/40'
            )}
            style={{
              left: resizerLeft,
            }}
          >
            <motion.div
              className={cn(
                'absolute flex h-16 w-6 cursor-col-resize items-center justify-center rounded-md border-2 border-primary/20 bg-background shadow-lg transition-all hover:border-primary/60 hover:shadow-xl',
                isDragging && 'border-primary/60 shadow-xl'
              )}
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
            >
              <GripVerticalIcon className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </motion.div>
        )}
      </div>
    </SlidingPanelContext.Provider>
  )
}

export interface SlidingPanelContentProps {
  children: React.ReactNode
  className?: string
}

export function SlidingPanelMain({ children, className }: SlidingPanelContentProps) {
  const { motionPanelWidth, isPanelOpen } = useSlidingPanel()

  const width = useTransform(
    motionPanelWidth,
    (value: number) => isPanelOpen ? `${value}%` : '100%'
  )

  return (
    <motion.div
      className={cn('h-full overflow-auto', className)}
      style={{ width }}
    >
      {children}
    </motion.div>
  )
}

export interface SlidingPanelSideProps {
  children: React.ReactNode
  className?: string
  title?: string
}

export function SlidingPanelSide({ children, className, title }: SlidingPanelSideProps) {
  const { motionPanelWidth, isPanelOpen, closePanel } = useSlidingPanel()

  const width = useTransform(
    motionPanelWidth,
    (value: number) => `${100 - value}%`
  )

  if (!isPanelOpen) return null

  return (
    <motion.div
      className={cn(
        'absolute right-0 top-0 h-full border-l border-border bg-background',
        className
      )}
      style={{ width }}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3 backdrop-blur-sm">
        <h2 className="gradient-text text-lg font-semibold">
          {title || 'My Awesome List'}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={closePanel}
          className="h-8 w-8 rounded-full"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close panel</span>
        </Button>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-57px)] overflow-auto">
        {children}
      </div>
    </motion.div>
  )
}
