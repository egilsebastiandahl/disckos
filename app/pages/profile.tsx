"use client"

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [profile, setProfile] = useState<any>(null)
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      const { data: sessionData } = await supabase.auth.getSession()
      const session = sessionData?.session
      if (!session) {
        router.push('/login')
        return
      }
      const token = session.access_token
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080'
      const res = await fetch(`${backendUrl}/api/profile`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) {
        setMessage('Failed to load profile')
        setLoading(false)
        return
      }
      const data = await res.json()
      setProfile(data)
      setUsername(data.username ?? '')
      setDisplayName(data.displayName ?? '')
      setBio(data.bio ?? '')
      setLoading(false)
    }
    fetchProfile()
  }, [router])

  async function handleSave(e: any) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    const { data: sessionData } = await supabase.auth.getSession()
    const session = sessionData?.session
    if (!session) {
      router.push('/login')
      return
    }
    const token = session.access_token
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080'
    const res = await fetch(`${backendUrl}/api/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ username: username || null, displayName: displayName || null, bio: bio || null }),
    })
    setSaving(false)
    if (!res.ok) {
      const text = await res.text()
      setMessage(text || 'Failed to save')
      return
    }
    setMessage('Profile saved')
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Your profile</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full border rounded p-2" rows={4} />
        </div>
        <div className="flex items-center gap-2">
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          {message && <span className="text-sm text-gray-700">{message}</span>}
        </div>
      </form>
    </div>
  )
}
