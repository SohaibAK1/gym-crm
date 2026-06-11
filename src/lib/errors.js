const MAP = [
  ['Invalid login credentials',                     'Invalid email or password.'],
  ['Email not confirmed',                            'Please confirm your email before signing in.'],
  ['User already registered',                        'An account with this email already exists.'],
  ['Password should be at least 6 characters',       'Password must be at least 6 characters.'],
  ['rate limit exceeded',                            'Too many attempts. Please try again in a few minutes.'],
  ['duplicate key value violates unique constraint', 'This record already exists.'],
  ['new row violates row-level security policy',     'You don\'t have permission to do this.'],
  ['value too long',                                 'One of the inputs is too long.'],
  ['JWT expired',                                    'Your session has expired. Please sign in again.'],
  ['missing sub claim',                              'Your session is invalid. Please sign in again.'],
  ['Password should be at least',                    'Password is too short.'],
  ['Unable to validate email address',               'Please enter a valid email address.'],
]

export function friendlyError(error) {
  if (!error) return 'An unexpected error occurred.'
  const msg = (error.message ?? String(error)).toLowerCase()
  for (const [pattern, friendly] of MAP) {
    if (msg.includes(pattern.toLowerCase())) return friendly
  }
  // In production hide raw Supabase internals; show them in dev for debugging
  return import.meta.env.PROD ? 'Something went wrong. Please try again.' : (error.message ?? String(error))
}
