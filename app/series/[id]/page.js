// app/series/[id]/page.js
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function SeriesDetail() {
  const { id } = useParams()
  const [series, setSeries] = useState(null)
  const [episodes, setEpisodes] = useState([])

  useEffect(() => {
    async function getDetail() {
      // Get Series Info
      const { data: s } = await supabase.from('series').select('*, artists(*)').eq('id', id).single()
      setSeries(s)
      
      // Get Episodes
      const { data: e } = await supabase.from('episodes').select('*').eq('series_id', id).order('episode_number', {ascending: false})
      setEpisodes(e)
    }
    if(id) getDetail()
  }, [id])

  if (!series) return <div className="p-10 text-center">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
        {/* Header Series */}
        <div className="flex flex-col md:flex-row gap-6 mb-10">
            <img src={series.cover_url} className="w-48 h-64 object-cover rounded-lg shadow-lg"/>
            <div>
                <h1 className="text-3xl font-bold">{series.title}</h1>
                <p className="text-blue-600 font-medium mb-4">{series.artists?.name}</p>
                <p className="text-gray-600">{series.description || "Belum ada deskripsi."}</p>
            </div>
        </div>

        {/* List Episode */}
        <h3 className="text-xl font-bold mb-4">Episode List</h3>
        <div className="space-y-3">
            {episodes.map(ep => (
                <div key={ep.id} className="flex justify-between items-center p-4 bg-white border rounded hover:bg-gray-50 cursor-pointer">
                    <span className="font-medium">#{ep.episode_number} - {ep.title}</span>
                    <span className="text-gray-400 text-sm">{new Date(ep.created_at).toLocaleDateString()}</span>
                </div>
            ))}
        </div>
    </div>
  )
}