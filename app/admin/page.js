// app/admin/page.js
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [title, setTitle] = useState('')
  const [artists, setArtists] = useState([])
  const [selectedArtist, setSelectedArtist] = useState('')
  const [coverFile, setCoverFile] = useState(null)
  const [loading, setLoading] = useState(false)

  // Load Artis untuk Dropdown
  useEffect(() => {
    async function getArtists() {
      const { data } = await supabase.from('artists').select('*')
      setArtists(data)
    }
    getArtists()
  }, [])

  async function handleUpload() {
    if(!coverFile || !title || !selectedArtist) return alert("Lengkapi data!")
    setLoading(true)

    // 1. Upload Gambar ke Supabase Storage
    const fileName = `${Date.now()}-${coverFile.name}`
    const { data: fileData, error: uploadError } = await supabase.storage
      .from('comic-images')
      .upload(fileName, coverFile)

    if (uploadError) {
        alert("Gagal upload gambar")
        setLoading(false)
        return
    }

    // 2. Ambil Public URL Gambar
    const { data: { publicUrl } } = supabase.storage.from('comic-images').getPublicUrl(fileName)

    // 3. Simpan data ke Tabel Series
    const { error: dbError } = await supabase.from('series').insert({
      title: title,
      artist_id: selectedArtist,
      cover_url: publicUrl
    })

    if (dbError) alert("Gagal simpan database")
    else alert("Berhasil tambah komik!")
    
    setLoading(false)
  }

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-xl font-bold mb-4">Add New Series</h2>
        
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Judul Komik" 
            className="w-full border p-2 rounded"
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <select className="w-full border p-2 rounded" onChange={(e) => setSelectedArtist(e.target.value)}>
            <option value="">Pilih Artist</option>
            {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Cover Image</label>
            <input type="file" onChange={(e) => setCoverFile(e.target.files[0])} />
          </div>

          <button 
            onClick={handleUpload} 
            disabled={loading}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400 w-full"
          >
            {loading ? 'Uploading...' : 'Publish Series'}
          </button>
        </div>
      </div>
    </div>
  )
}