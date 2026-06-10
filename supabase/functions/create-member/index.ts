import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') ?? 'https://gym-crm-navy.vercel.app'

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS pre-flight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders })
  }

  // ── Verify the caller is an authenticated admin ──────────────────
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const anonClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  const { data: { user: caller }, error: authError } = await anonClient.auth.getUser()
  if (authError || !caller) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const { data: callerProfile } = await anonClient
    .from('profiles')
    .select('role')
    .eq('id', caller.id)
    .single()

  if (callerProfile?.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Forbidden: admin only' }), {
      status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // ── Parse request body ───────────────────────────────────────────
  let body: {
    email: string
    password: string
    full_name?: string
    phone?: string
    goal?: string
    slot?: string
  }

  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const { email, password, full_name, phone, goal, slot } = body

  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'email and password are required' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // ── Create the auth user with service-role key ───────────────────
  const adminClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,          // skip email verification for gym-managed accounts
    user_metadata: { role: 'member', full_name },
  })

  if (createError) {
    return new Response(JSON.stringify({ error: createError.message }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // ── Populate the auto-created profile row ────────────────────────
  const updates: Record<string, unknown> = {}
  if (full_name) updates.full_name = full_name
  if (phone)     updates.phone     = phone
  if (goal)      updates.goal      = goal
  if (slot)      updates.slot      = slot

  if (Object.keys(updates).length > 0) {
    await adminClient
      .from('profiles')
      .update(updates)
      .eq('id', newUser.user.id)
  }

  return new Response(
    JSON.stringify({ user: { id: newUser.user.id, email: newUser.user.email } }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})
