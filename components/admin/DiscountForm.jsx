'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client.js'

const CATEGORIES = [
  { value: 'sport', label: 'Спорт' },
  { value: 'english', label: 'Английский' },
  { value: 'courses', label: 'Курсы' },
  { value: 'food', label: 'Еда' },
  { value: 'health', label: 'Здоровье' },
  { value: 'other', label: 'Другое' },
]

const titleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.5rem',
  fontWeight: 700,
  marginBottom: '24px',
}

const formStyle = {
  maxWidth: '640px',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '16px',
  padding: '32px',
}

const labelStyle = {
  display: 'block',
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: 'var(--color-text)',
  marginBottom: '16px',
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-body)',
  border: '1px solid var(--color-border)',
  borderRadius: '8px',
  outline: 'none',
  boxSizing: 'border-box',
  marginTop: '4px',
}

const textareaStyle = {
  ...inputStyle,
  minHeight: '100px',
  resize: 'vertical',
}

const btnStyle = {
  padding: '8px 16px',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-body)',
  border: '1px solid var(--color-border)',
  borderRadius: '8px',
  cursor: 'pointer',
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
}

const primaryBtnStyle = {
  ...btnStyle,
  background: 'var(--color-accent)',
  color: 'white',
  border: '1px solid var(--color-accent)',
}

const EMPTY = {
  partner_name: '',
  category: 'sport',
  discount_value: '',
  short_description: '',
  full_description: '',
  conditions: '',
  promo_codes: [{ code: '', description: '' }],
  link: '',
  valid_until: '',
  is_active: true,
}

export default function DiscountForm({ discount }) {
  const isEdit = !!discount
  const [form, setForm] = useState(() => {
    if (!discount) return EMPTY
    const codes = Array.isArray(discount.promo_codes) && discount.promo_codes.length
      ? discount.promo_codes
      : [{ code: '', description: '' }]
    return {
      partner_name: discount.partner_name || '',
      category: discount.category || 'sport',
      discount_value: discount.discount_value || '',
      short_description: discount.short_description || '',
      full_description: discount.full_description || '',
      conditions: discount.conditions || '',
      promo_codes: codes,
      link: discount.link || '',
      valid_until: discount.valid_until || '',
      is_active: discount.is_active !== false,
    }
  })
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(discount?.logo_url || null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const supabase = createClient()

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleLogoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  async function uploadLogo() {
    if (!logoFile) return discount?.logo_url || null
    const ext = (logoFile.name.split('.').pop() || 'png').toLowerCase()
    const rand = Math.random().toString(36).slice(2, 8)
    const filePath = `discounts/${Date.now()}-${rand}.${ext}`

    const { error: uploadError } = await supabase.storage.from('media').upload(filePath, logoFile, {
      cacheControl: '3600',
      upsert: false,
    })
    if (uploadError) throw new Error('Ошибка загрузки логотипа: ' + uploadError.message)

    const { data } = supabase.storage.from('media').getPublicUrl(filePath)
    return data.publicUrl
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.partner_name.trim()) { setError('Название партнёра обязательно'); return }
    if (!form.discount_value.trim()) { setError('Размер скидки обязателен'); return }

    setSaving(true)
    try {
      const logo_url = await uploadLogo()
      const row = {
        partner_name: form.partner_name.trim(),
        category: form.category,
        discount_value: form.discount_value.trim(),
        short_description: form.short_description.trim() || null,
        full_description: form.full_description.trim() || null,
        conditions: form.conditions.trim() || null,
        promo_codes: form.promo_codes.filter((p) => p.code.trim()).map((p) => ({ code: p.code.trim(), description: p.description.trim() })),
        link: form.link.trim() || null,
        logo_url,
        valid_until: form.valid_until || null,
        is_active: form.is_active,
      }

      if (isEdit) {
        const { error: err } = await supabase.from('discounts').update(row).eq('id', discount.id)
        if (err) throw new Error(err.message)
      } else {
        const { error: err } = await supabase.from('discounts').insert(row)
        if (err) throw new Error(err.message)
      }

      router.push('/admin/discounts')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 style={titleStyle}>{isEdit ? 'Редактировать скидку' : 'Новая скидка'}</h1>

      <form style={formStyle} onSubmit={handleSubmit}>
        <label style={labelStyle}>
          Название партнёра *
          <input style={inputStyle} value={form.partner_name} onChange={(e) => set('partner_name', e.target.value)} placeholder="World Class" />
        </label>

        <div style={{ display: 'flex', gap: '16px' }}>
          <label style={{ ...labelStyle, flex: 1 }}>
            Категория
            <select style={inputStyle} value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </label>
          <label style={{ ...labelStyle, flex: 1 }}>
            Размер скидки *
            <input style={inputStyle} value={form.discount_value} onChange={(e) => set('discount_value', e.target.value)} placeholder="-25%" />
          </label>
        </div>

        <label style={labelStyle}>
          Краткое описание
          <input style={inputStyle} value={form.short_description} onChange={(e) => set('short_description', e.target.value)} placeholder="Годовой абонемент, любой клуб" maxLength={100} />
        </label>

        <label style={labelStyle}>
          Полное описание
          <textarea style={textareaStyle} value={form.full_description} onChange={(e) => set('full_description', e.target.value)} placeholder="Подробное описание скидки..." />
        </label>

        <label style={labelStyle}>
          Условия
          <textarea style={{ ...textareaStyle, minHeight: '80px' }} value={form.conditions} onChange={(e) => set('conditions', e.target.value)} placeholder="Условия получения скидки..." />
        </label>

        <div style={{ ...labelStyle, marginBottom: '16px' }}>
          Промокоды
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
            {form.promo_codes.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  style={{ ...inputStyle, flex: 1, marginTop: 0 }}
                  value={p.code}
                  onChange={(e) => {
                    const next = [...form.promo_codes]
                    next[i] = { ...next[i], code: e.target.value }
                    set('promo_codes', next)
                  }}
                  placeholder="ADCORP25"
                />
                <input
                  style={{ ...inputStyle, flex: 1, marginTop: 0 }}
                  value={p.description}
                  onChange={(e) => {
                    const next = [...form.promo_codes]
                    next[i] = { ...next[i], description: e.target.value }
                    set('promo_codes', next)
                  }}
                  placeholder="Описание (необязательно)"
                />
                {form.promo_codes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => set('promo_codes', form.promo_codes.filter((_, j) => j !== i))}
                    style={{ ...btnStyle, padding: '6px 10px', color: '#dc2626', borderColor: '#fecaca', flexShrink: 0 }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => set('promo_codes', [...form.promo_codes, { code: '', description: '' }])}
            style={{ ...btnStyle, marginTop: '8px', fontSize: '0.75rem' }}
          >
            + Добавить промокод
          </button>
        </div>

        <label style={labelStyle}>
          Ссылка
          <input style={inputStyle} value={form.link} onChange={(e) => set('link', e.target.value)} placeholder="https://..." />
        </label>

        <label style={labelStyle}>
          Логотип
          <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {logoPreview && (
              <img src={logoPreview} alt="" style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
            )}
            <input type="file" accept="image/*" onChange={handleLogoChange} style={{ fontSize: '0.8125rem' }} />
          </div>
        </label>

        <div style={{ display: 'flex', gap: '16px' }}>
          <label style={{ ...labelStyle, flex: 1 }}>
            Действует до
            <input type="date" style={inputStyle} value={form.valid_until} onChange={(e) => set('valid_until', e.target.value)} />
          </label>
          <label style={{ ...labelStyle, flex: 1, display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
            <input type="checkbox" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} style={{ width: 18, height: 18 }} />
            Активна
          </label>
        </div>

        {error && (
          <div style={{ padding: '8px 12px', fontSize: '0.8125rem', color: '#dc2626', background: '#fef2f2', borderRadius: '6px', marginBottom: '12px' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button type="button" style={btnStyle} onClick={() => router.push('/admin/discounts')}>
            Отмена
          </button>
          <button type="submit" style={primaryBtnStyle} disabled={saving}>
            {saving ? 'Сохранение...' : (isEdit ? 'Сохранить' : 'Создать')}
          </button>
        </div>
      </form>
    </div>
  )
}
