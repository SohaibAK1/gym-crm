import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Megaphone, PlusCircle, X, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement } from '../../hooks/useAnnouncements'
import { friendlyError } from '../../lib/errors'

const BC  = "'Barlow Condensed', sans-serif"
const INT = 'Inter, system-ui, sans-serif'
const YLW = '#FACC15'
const CRD = '#1E1C18'
const BRD = 'rgba(250,204,21,0.1)'

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
        style={{ fontFamily: INT, color: 'rgba(249,250,251,0.5)' }}>
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputBase = {
  className: 'w-full px-4 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none transition-colors',
  style: { fontFamily: INT, background: 'rgba(249,250,251,0.04)', border: '1px solid rgba(250,204,21,0.15)' },
  onFocus: e => { e.target.style.borderColor = 'rgba(250,204,21,0.5)' },
  onBlur:  e => { e.target.style.borderColor = 'rgba(250,204,21,0.15)' },
}

function PostModal({ open, editing, onClose }) {
  const blank = { title: '', body: '' }
  const [form, setForm]       = useState(blank)
  const [success, setSuccess] = useState(false)
  const { mutate: create, isPending: creating, error: createErr, reset: resetCreate } = useCreateAnnouncement()
  const { mutate: update, isPending: updating, error: updateErr, reset: resetUpdate } = useUpdateAnnouncement()

  const isEdit = !!editing
  const isPending = creating || updating
  const error     = createErr || updateErr

  // Pre-fill when editing
  useState(() => {
    if (editing) setForm({ title: editing.title, body: editing.body ?? '' })
    else         setForm(blank)
  }, [editing])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    const onSuccess = () => {
      setSuccess(true)
      setTimeout(() => { setSuccess(false); setForm(blank); resetCreate(); resetUpdate(); onClose() }, 1200)
    }
    if (isEdit) update({ id: editing.id, ...form }, { onSuccess })
    else        create(form, { onSuccess })
  }

  const handleClose = () => { resetCreate(); resetUpdate(); setSuccess(false); setForm(blank); onClose() }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
            onClick={handleClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-lg rounded-2xl p-6"
              style={{ background: '#1E1C18', border: '1px solid rgba(250,204,21,0.2)', boxShadow: '0 0 80px rgba(0,0,0,0.7)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white" style={{ fontFamily: BC }}>
                  {isEdit ? 'EDIT POST' : 'NEW POST'}
                </h2>
                <button onClick={handleClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {success ? (
                <div className="py-10 text-center">
                  <p className="text-5xl mb-3">📣</p>
                  <p className="text-xl font-black text-white" style={{ fontFamily: BC }}>POSTED!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Field label="Title" required>
                    <input value={form.title} onChange={set('title')} required placeholder="e.g. Gym closed on Sunday" maxLength={200} {...inputBase} />
                  </Field>
                  <Field label="Message">
                    <textarea value={form.body} onChange={set('body')} rows={4}
                      placeholder="Optional details…"
                      maxLength={2000}
                      {...inputBase}
                      className="w-full px-4 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none transition-colors resize-none" />
                  </Field>
                  {error && <p className="text-red-400 text-sm" style={{ fontFamily: INT }}>{friendlyError(error)}</p>}
                  <button type="submit" disabled={isPending}
                    className="w-full py-3 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
                    style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}>
                    {isPending
                      ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      : isEdit ? 'Save Changes' : 'Publish'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function AdminAnnouncements() {
  const { data: posts = [], isLoading } = useAnnouncements()
  const { mutate: remove }              = useDeleteAnnouncement()
  const { mutate: toggle }              = useUpdateAnnouncement()
  const [showModal, setShowModal]       = useState(false)
  const [editing, setEditing]           = useState(null)

  const handleEdit = post => { setEditing(post); setShowModal(true) }
  const handleClose = ()  => { setEditing(null); setShowModal(false) }

  return (
    <div className="max-w-4xl mx-auto">
      <PostModal open={showModal} editing={editing} onClose={handleClose} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-white mb-1" style={{ fontFamily: BC }}>ANNOUNCEMENTS</h1>
          <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.45)' }}>
            Post notices visible to all members
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-80"
          style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}>
          <PlusCircle className="w-4 h-4" /> New Post
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: CRD, border: `1px solid ${BRD}` }} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl py-20 flex flex-col items-center justify-center gap-4"
          style={{ background: CRD, border: `1px solid ${BRD}` }}>
          <Megaphone className="w-10 h-10" style={{ color: 'rgba(249,250,251,0.15)' }} />
          <div className="text-center">
            <p className="text-base font-black text-white mb-1" style={{ fontFamily: BC }}>NO ANNOUNCEMENTS YET</p>
            <p className="text-sm" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.35)' }}>
              Create a post to notify all Golden Biceps members.
            </p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-80"
            style={{ fontFamily: INT, background: YLW, color: '#0A0A0A' }}>
            <PlusCircle className="w-4 h-4" /> Create First Post
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(p => (
            <motion.div key={p.id} layout
              className="rounded-2xl p-5" style={{ background: CRD, border: p.is_active ? `1px solid rgba(250,204,21,0.2)` : `1px solid ${BRD}`, opacity: p.is_active ? 1 : 0.6 }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {p.is_active && (
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: YLW }} />
                    )}
                    <h3 className="text-base font-black text-white" style={{ fontFamily: BC }}>{p.title}</h3>
                  </div>
                  {p.body && (
                    <p className="text-sm leading-relaxed" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.65)' }}>
                      {p.body}
                    </p>
                  )}
                  <p className="text-xs mt-2" style={{ fontFamily: INT, color: 'rgba(249,250,251,0.3)' }}>
                    {fmtDate(p.created_at)} · {p.author?.full_name ?? 'Admin'}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => toggle({ id: p.id, is_active: !p.is_active })}
                    className="p-2 rounded-lg transition-colors hover:text-white"
                    style={{ color: p.is_active ? '#34D399' : 'rgba(249,250,251,0.3)' }}
                    title={p.is_active ? 'Hide from members' : 'Show to members'}>
                    {p.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleEdit(p)}
                    className="p-2 rounded-lg transition-colors text-gray-500 hover:text-white">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => window.confirm('Delete this announcement?') && remove(p.id)}
                    className="p-2 rounded-lg transition-colors text-gray-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
