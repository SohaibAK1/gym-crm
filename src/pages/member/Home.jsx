import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sun, Moon, CheckCircle, Flame, Calendar,
  Dumbbell, ChevronRight, Bell, Clock,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useSelfCheckIn } from '../../hooks/useAttendance'
import {
  useMemberSubscription, useMemberRoutine,
  useMemberAttendanceAll, calcStreak, useMemberAnnouncements,
} from '../../hooks/useMemberData'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const IBP = "'IBM Plex Mono', ui-monospace, monospace"
const YLW = '#FACC15'
const CRD = '#1E1C18'
const BRD = 'rgba(250,204,21,0.1)'
const PLAN_COLOR = { monthly: '#60A5FA', quarterly: YLW, annual: '#34D399' }

function daysLeft(d) { return Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000)) }

// ── Reusable card wrapper ─────────────────────────────────────────
function Card({ children, className = '', style = {}, onClick, as: Tag = 'div' }) {
  return (
    <Tag
      onClick={onClick}
      className={`rounded-2xl ${onClick || Tag === Link ? 'cursor-pointer' : ''} ${className}`}
      style={{ background: CRD, border: `1px solid ${BRD}`, ...style }}
    >
      {children}
    </Tag>
  )
}

export default function MemberHome() {
  const { profile } = useAuth()
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Member'

  const { data: memberships = [] }   = useMemberSubscription()
  const { data: routine }            = useMemberRoutine()
  const { data: attendance = [] }    = useMemberAttendanceAll()
  const { data: announcements = [] } = useMemberAnnouncements()
  const { mutate: checkIn, isPending } = useSelfCheckIn()

  const activePlan     = memberships.find(m => m.is_active && daysLeft(m.end_date) > 0)
  const streak         = calcStreak(attendance)
  const remaining      = activePlan ? daysLeft(activePlan.end_date) : 0
  const todayStr       = new Date().toISOString().split('T')[0]
  const todayRecords   = attendance.filter(r => new Date(r.checked_in_at).toISOString().split('T')[0] === todayStr)
  const checkedMorning = todayRecords.some(r => r.slot === 'morning')
  const checkedEvening = todayRecords.some(r => r.slot === 'evening')
  const allChecked     = checkedMorning && checkedEvening

  const monthCount = new Set(
    attendance
      .filter(r => {
        const d = new Date(r.checked_in_at), n = new Date()
        return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear()
      })
      .map(r => new Date(r.checked_in_at).toISOString().split('T')[0])
  ).size

  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr  = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  const STATS = [
    {
      value: streak,
      label: 'Day Streak',
      icon: <Flame className="w-4 h-4" />,
      color: streak > 0 ? '#FB923C' : 'rgba(249,250,251,0.2)',
    },
    {
      value: monthCount,
      label: 'This Month',
      icon: <Calendar className="w-4 h-4" />,
      color: YLW,
    },
    {
      value: remaining || '—',
      label: 'Plan Days',
      icon: <Clock className="w-4 h-4" />,
      color: !activePlan ? 'rgba(249,250,251,0.2)' : remaining <= 7 ? '#FB923C' : '#34D399',
    },
  ]

  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-6 space-y-4">

      {/* ── Greeting ── */}
      <div className="pb-2">
        <p className="text-sm mb-1" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
          {greeting},
        </p>
        <h1 className="text-5xl font-black text-white leading-none" style={{ fontFamily: BC }}>
          {firstName.toUpperCase()}
        </h1>
        <p className="text-xs mt-2" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
          {dateStr}
        </p>
      </div>

      {/* ── Check-in block ── */}
      {allChecked ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: 'rgba(52,211,153,0.1)', border: '1.5px solid rgba(52,211,153,0.35)' }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(52,211,153,0.2)' }}>
            <CheckCircle className="w-6 h-6" style={{ color: '#34D399' }} />
          </div>
          <div>
            <p className="text-xl font-black" style={{ fontFamily: BC, color: '#34D399' }}>
              ALL DONE TODAY
            </p>
            <p className="text-xs mt-0.5" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
              Morning &amp; evening — great discipline!
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="rounded-2xl p-5" style={{ background: YLW }}>
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-1"
            style={{ fontFamily: INT, color: 'rgba(0,0,0,0.45)' }}>
            Mark today&apos;s attendance
          </p>
          <p className="text-3xl font-black mb-4" style={{ fontFamily: BC, color: '#0A0A0A' }}>
            CHECK IN NOW
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { slot: 'morning', label: 'Morning', Icon: Sun,  checked: checkedMorning },
              { slot: 'evening', label: 'Evening', Icon: Moon, checked: checkedEvening },
            ].map(({ slot, label, Icon, checked }) => (
              <button
                key={slot}
                onClick={() => !checked && checkIn({ slot })}
                disabled={checked || isPending}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer disabled:cursor-default"
                style={{
                  fontFamily: INT,
                  background: checked ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.15)',
                  color: checked ? 'rgba(0,0,0,0.45)' : '#0A0A0A',
                  border: checked ? '1.5px solid rgba(0,0,0,0.2)' : '1.5px solid transparent',
                  textDecoration: checked ? 'line-through' : 'none',
                }}
              >
                {checked
                  ? <CheckCircle className="w-4 h-4" />
                  : <Icon className="w-4 h-4" />
                }
                {label}
              </button>
            ))}
          </div>
          {(checkedMorning || checkedEvening) && (
            <p className="text-[11px] text-center mt-3" style={{ fontFamily: INT, color: 'rgba(0,0,0,0.5)' }}>
              {checkedMorning ? 'Morning done — check in evening too!' : 'Evening done — check in morning too!'}
            </p>
          )}
        </div>
      )}

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-3 gap-3">
        {STATS.map(({ value, label, icon, color }) => (
          <Card key={label} className="p-4 text-center">
            <div className="flex items-center justify-center mb-1.5" style={{ color }}>
              {icon}
            </div>
            <p className="text-2xl font-black leading-none mb-1" style={{ fontFamily: IBP, color }}>
              {value}
            </p>
            <p className="text-[10px] leading-tight" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.38)' }}>
              {label}
            </p>
          </Card>
        ))}
      </div>

      {/* ── Today's workout ── */}
      <Card
        as={Link}
        to="/member/routine"
        className="block p-5 transition-colors duration-200 hover:border-yellow-400/25"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(250,204,21,0.12)' }}>
              <Dumbbell className="w-4 h-4" style={{ color: YLW }} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider"
                style={{ fontFamily: INT, color: 'rgba(249,250,251,0.38)' }}>Workout</p>
              <p className="text-base font-black text-white leading-tight" style={{ fontFamily: BC }}>
                {routine ? routine.name.toUpperCase() : 'MY ROUTINE'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold"
            style={{ fontFamily: INT, color: YLW }}>
            Open <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {routine?.routine_days?.[0]?.exercises?.length > 0 ? (
          <div className="space-y-2.5">
            {routine.routine_days[0].exercises.slice(0, 4).map((ex, i) => (
              <div key={ex.id} className="flex items-center gap-3">
                <span className="text-[11px] font-bold w-5 text-right flex-shrink-0"
                  style={{ fontFamily: IBP, color: 'rgba(249,250,251,0.25)' }}>
                  {i + 1}
                </span>
                <p className="text-sm text-white flex-1 truncate" style={{ fontFamily: INT }}>
                  {ex.name}
                </p>
                <p className="text-xs flex-shrink-0" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
                  {[ex.sets && `${ex.sets}×`, ex.reps].filter(Boolean).join('')}
                </p>
              </div>
            ))}
            {routine.routine_days[0].exercises.length > 4 && (
              <p className="text-xs text-center pt-1"
                style={{ fontFamily: INT, color: 'rgba(249,250,251,0.3)' }}>
                +{routine.routine_days[0].exercises.length - 4} more
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.3)' }}>
            No routine assigned yet — your trainer will set one up.
          </p>
        )}
      </Card>

      {/* ── Membership quick link ── */}
      <Card
        as={Link}
        to="/member/profile"
        className="flex items-center justify-between px-5 py-4 transition-colors duration-200 hover:border-yellow-400/25"
      >
        <div>
          <p className="text-[10px] uppercase tracking-wider mb-1"
            style={{ fontFamily: INT, color: 'rgba(249,250,251,0.38)' }}>Membership</p>
          <p className="text-base font-black capitalize leading-tight"
            style={{ fontFamily: BC, color: activePlan ? PLAN_COLOR[activePlan.plan_type] ?? YLW : 'rgba(249,250,251,0.3)' }}>
            {activePlan ? `${activePlan.plan_type} Plan` : 'No Active Plan'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {activePlan && (
            <div className="text-right">
              <p className="text-xl font-black leading-none"
                style={{ fontFamily: IBP, color: remaining <= 7 ? '#FB923C' : 'rgba(249,250,251,0.7)' }}>
                {remaining}
              </p>
              <p className="text-[10px]" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
                days left
              </p>
            </div>
          )}
          <ChevronRight className="w-4 h-4" style={{ color: 'rgba(249,250,251,0.25)' }} />
        </div>
      </Card>

      {/* ── Gym timings ── */}
      <Card className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider mb-4"
          style={{ fontFamily: INT, color: 'rgba(249,250,251,0.38)' }}>
          Gym Timings
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              slot: 'morning', label: 'Morning', time: '6:00 – 10:00 AM',
              Icon: Sun, color: YLW, bg: 'rgba(250,204,21,0.08)',
              mine: profile?.slot === 'morning' || profile?.slot === 'both',
            },
            {
              slot: 'evening', label: 'Evening', time: '4:00 – 9:00 PM',
              Icon: Moon, color: '#60A5FA', bg: 'rgba(96,165,250,0.08)',
              mine: profile?.slot === 'evening' || profile?.slot === 'both',
            },
          ].map(({ label, time, Icon, color, bg, mine }) => (
            <div key={label} className="rounded-xl p-4"
              style={{ background: bg, border: mine ? `1px solid ${color}50` : '1px solid transparent' }}>
              <Icon className="w-5 h-5 mb-3" style={{ color }} />
              <p className="text-sm font-bold mb-0.5" style={{ fontFamily: INT, color }}>
                {label}
                {mine && (
                  <span className="ml-1.5 text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                    style={{ background: `${color}25`, color }}>
                    Your slot
                  </span>
                )}
              </p>
              <p className="text-xs" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
                {time}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Announcements ── */}
      {announcements.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider px-1"
            style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
            Announcements
          </p>
          {announcements.map(a => (
            <Card key={a.id} className="p-4"
              style={{ background: CRD, border: '1px solid rgba(250,204,21,0.18)' }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(250,204,21,0.12)' }}>
                  <Bell className="w-4 h-4" style={{ color: YLW }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white leading-snug" style={{ fontFamily: INT }}>
                    {a.title}
                  </p>
                  {a.body && (
                    <p className="text-xs mt-1 leading-relaxed"
                      style={{ fontFamily: INT, color: 'rgba(249,250,251,0.5)' }}>
                      {a.body}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  )
}
