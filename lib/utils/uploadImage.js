import { createClient } from '../supabase/client.js'

/**
 * Upload an image file to the Supabase "media" bucket and return its public URL.
 * Returns null on failure.
 */
export async function uploadImageToStorage(file) {
  if (!file) return null
  const supabase = createClient()
  const ext = (file.name.split('.').pop() || 'png').toLowerCase()
  const rand = Math.random().toString(36).slice(2, 8)
  const filePath = `articles/${Date.now()}-${rand}.${ext}`

  const { error } = await supabase.storage.from('media').upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    console.error('Image upload failed:', error.message)
    return null
  }

  const { data } = supabase.storage.from('media').getPublicUrl(filePath)
  return data.publicUrl
}
