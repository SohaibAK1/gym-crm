import { CreditCard, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { useMemberSubscription } from '../../hooks/useMemberData'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const IBP = "'IBM Plex Mono', ui-monospace, monospace"
const YLW = '#FACC15'
const CRD = '#1E1C18'
const BRD = 'rgba(250,204,21,0.1)'

const PLAN_CFG = {
  monthly:   { label: 'Monthly',   color: '#60A5FA', bg: 'rgba(96,165,250,0.1)',   total: 30  },
  quarterly: { label: 'Quarterly', color: YLW,       bg: 'rgba(250,204,21,0.1)',   total: 90  },
  annual:    { label: 'Annual',     color: '#34D399', bg: 'rgba(52,211,153,0.1)',   total: 365 },
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}
function fmtRs(v) { return `₹${Number(v).toLocaleString('en-IN')}` }
function daysLeft(d) { return Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000)) }

export default function MemberSubscription() {
  const { data: memberships = [], isLoading } = useMemberSubscription()

  const activePlan = memberships.find(m => m.is_active && daysLeft(m.end_date) > 0)
  const pastPlans  = memberships.filter(m => m.id !== activePlan?.id)

  const remaining = activePlan ? daysLeft(activePlan.end_date) : 0
  const cfg       = activePlan ? PLAN_CFG[activePlan.plan_type] : null
  const totalDays = cfg?.total ?? 30
  const usedDays  = activePlan
    ? Math.max(0, Math.ceil((new Date() - new Date(activePlan.start_date)) / 86400000))
    : 0
  const progressPct = Math.min(100, Math.round((usedDays / totalDays) * 100))

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-5">
      <div>
        <h1 className="text-4xl font-black text-white mb-0.5" style={{ fontFamily: BC }}>MEMBERSHIP</h1>
        <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
          Your current plan &amp; history
        </p>
      </div>

      {/* Active plan */}
      {isLoading ? (
        <div className="h-48 rounded-2xl animate-pulse" style={{ background: CRD }} />
      ) : activePlan ? (
        <div className="rounded-2xl p-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1E1C18 0%, #251F10 100%)', border: `1.5px solid ${cfg?.color}33` }}>
          {/* Glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${cfg?.color}20 0%, transparent 70%)` }} />

          <div className="flex items-start justify-between mb-5 relative">
            <div>
              <p className="text-[10px] uppercase tracking-wider mb-1"
                style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>Active Plan</p>
              <p className="text-3xl font-black" style={{ fontFamily: BC, color: cfg?.color }}>
                {cfg?.label?.toUpperCase()} PLAN
              </p>
            </div>
            <CreditCard className="w-6 h-6 flex-shrink-0" style={{ color: cfg?.color }} />
          </div>

          <p className="text-3xl font-black mb-5 relative"
            style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.9)' }}>
            {fmtRs(activePlan.amount)}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-5 relative">
            {[
              { label: 'Start Date',  value: fmtDate(activePlan.start_date) },
              { label: 'Expires',     value: fmtDate(activePlan.end_date)    },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] uppercase tracking-wider mb-0.5"
                  style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>{label}</p>
                <p className="text-sm font-semibold text-white" style={{ fontFamily: INT }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Days remaining + progress bar */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
                {usedDays} of {totalDays} days used
              </p>
              <p className="text-sm font-black" style={{ fontFamily: IBP, color: remaining <= 7 ? '#FB923C' : cfg?.color }}>
                {remaining} days left
              </p>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(249,250,251,0.08)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%`, background: remaining <= 7 ? '#FB923C' : cfg?.color }} />
            </div>
            {remaining <= 7 && (
              <p className="text-xs mt-2" style={{ fontFamily: INT, color: '#FB923C' }}>
                ⚠ Expiring soon — contact your trainer to renew
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-8 flex flex-col items-center gap-3"
          style={{ background: CRD, border: `1px solid ${BRD}` }}>
          <XCircle className="w-10 h-10" style={{ color: 'rgba(249,250,251,0.2)' }} />
          <p className="text-base font-black text-white" style={{ fontFamily: BC }}>NO ACTIVE PLAN</p>
          <p className="text-sm text-center" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>
            Contact the front desk or your trainer to get a membership plan.
          </p>
        </div>
      )}

      {/* Payment history */}
      {pastPlans.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
            Payment History
          </p>
          <div className="rounded-2xl overflow-hidden" style={{ background: CRD, border: `1px solid ${BRD}` }}>
            {pastPlans.map((m, i) => {
              const c = PLAN_CFG[m.plan_type]
              return (
                <div key={m.id}
                  className="flex items-center gap-4 px-5 py-4"
                  style={{ borderBottom: i < pastPlans.length - 1 ? `1px solid ${BRD}` : 'none' }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: c?.bg ?? 'rgba(249,250,251,0.05)' }}>
                    <Calendar className="w-4 h-4" style={{ color: c?.color ?? 'rgba(249,250,251,0.4)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white capitalize" style={{ fontFamily: INT }}>
                      {m.plan_type} Plan
                    </p>
                    <p className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.4)' }}>
                      {fmtDate(m.start_date)} – {fmtDate(m.end_date)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold" style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.7)' }}>
                      {fmtRs(m.amount)}
                    </p>
                    <p className="text-[10px]"
                      style={{ fontFamily: INT, color: m.is_active ? '#34D399' : 'rgba(249,250,251,0.3)' }}>
                      {m.is_active ? 'Active' : 'Expired'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
