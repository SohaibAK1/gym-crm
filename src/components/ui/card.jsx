import { cn } from '@/lib/utils'

export function Card({ className, ...props }) {
  return (
    <div
      className={cn('rounded-xl border border-white/10 bg-[#0a0a0a] shadow', className)}
      {...props}
    />
  )
}
