'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '../../../../../lib/supabase/client.js'
import DiscountForm from '../../../../../components/admin/DiscountForm.jsx'

export default function EditDiscountPage() {
  const { id } = useParams()
  const router = useRouter()
  const [discount, setDiscount] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data, error } = await supabase.from('discounts').select('*').eq('id', Number(id)).single()
      if (error || !data) {
        router.push('/admin/discounts')
        return
      }
      setDiscount(data)
      setLoading(false)
    }
    load()
  }, [id, router])

  if (loading) return <div style={{ padding: '40px', color: 'var(--color-text-secondary)' }}>Загрузка...</div>

  return <DiscountForm discount={discount} />
}
