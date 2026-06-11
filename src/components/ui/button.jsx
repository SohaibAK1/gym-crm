import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15]/50 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:     'bg-[#FACC15] text-[#0A0A0A] font-bold hover:bg-[#FACC15]/90',
        destructive: 'bg-red-600 text-white hover:bg-red-600/90',
        outline:     'border border-white/15 bg-transparent text-white/75 hover:bg-white/10 hover:text-white',
        secondary:   'bg-white/10 text-white hover:bg-white/20',
        ghost:       'text-white/70 hover:bg-white/10 hover:text-white',
        link:        'text-[#FACC15] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm:      'h-9 rounded-md px-3',
        lg:      'h-11 rounded-md px-8',
        icon:    'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size:    'default',
    },
  },
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = 'Button'

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
