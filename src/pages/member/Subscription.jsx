import { CreditCard } from 'lucide-react'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const IBP = "'IBM Plex Mono', ui-monospace, monospace"
const YLW = '#FACC15'
const CRD = '#1E1C18'
const BRD = 'rgba(250,204,21,0.1)'

export default function MemberSubscription() {
  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <h1 className="text-4xl font-black text-white mb-1" style={{ fontFamily: BC }}>MEMBERSHIP</h1>
      <p className="text-sm mb-6" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
        Your current plan and history
      </p>

      {/* Active plan card */}
      <div
        className="rounded-2xl p-6 mb-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E1C18 0%, #2A2510 100%)', border: `1px solid rgba(250,204,21,0.25)` }}
      >
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.12) 0%, transparent 70%)' }}
        />
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
              Active Plan
            </p>
            <p className="text-2xl font-black text-white" style={{ fontFamily: BC }}>— PLAN</p>
          </div>
          <CreditCard className="w-6 h-6 flex-shrink-0" style={{ color: YLW }} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs mb-0.5" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>Valid Until</p>
            <p className="font-bold text-white" style={{ fontFamily: IBP }}>—</p>
          </div>
          <div>
            <p className="text-xs mb-0.5" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>Days Left</p>
            <p className="font-bold" style={{ fontFamily: IBP, color: YLW }}>—</p>
          </div>
        </div>
      </div>

      {/* Payment history */}
      <div className="rounded-2xl p-5" style={{ background: CRD, border: `1px solid ${BRD}` }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
          Payment History
        </p>
        <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.3)' }}>
          No payment records yet.
        </p>
      </div>
    </div>
  )
}
