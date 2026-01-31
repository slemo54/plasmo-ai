'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import { Loader2 } from '@/components/ui/icons'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        router.push('/login')
        return
      }

      // Crea il profilo utente se non esiste
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (!profile) {
        // Crea profilo con crediti iniziali
        await supabase.from('profiles').insert({
          id: session.user.id,
          email: session.user.email!,
          credits: 8,
        } as any)

        // Registra transazione bonus
        await supabase.from('credit_transactions').insert({
          user_id: session.user.id,
          amount: 8,
          type: 'bonus',
          description: 'Crediti benvenuto',
        } as any)
      }

      router.push('/dashboard')
      router.refresh()
    }

    handleAuthCallback()
  }, [router, supabase])

  return (
    <div className="min-h-screen bg-[#090a0f] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Verifica in corso...</p>
      </div>
    </div>
  )
}
