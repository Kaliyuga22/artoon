'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css' // Import CSS Swiper
import Link from 'next/link'

export default function Home() {
  const [artists, setArtists] = useState([])
  const [newSeries, setNewSeries] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    // Ambil data Artist
    const { data: artistData } = await supabase.from('artists').select('*')
    setArtists(artistData)

    // Ambil data Series terbaru
    const { data: seriesData } = await supabase.from('series').select('*, artists(name)').order('created_at', { ascending: false }).limit(6)
    setNewSeries(seriesData)
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-10">
      
      {/* 1. CAROUSEL BANNER */}
      <div className="w-full h-[300px] md:h-[500px] bg-gray-900">
        <Swiper className="h-full w-full">
            {/* Contoh Slide Statis - Nanti bisa diambil dari DB */}
            <SwiperSlide className="flex items-center justify-center bg-blue-600 text-white text-3xl font-bold">
              Promo Komik A
            </SwiperSlide>
            <SwiperSlide className="flex items-center justify-center bg-red-600 text-white text-3xl font-bold">
              Event Spesial
            </SwiperSlide>
        </Swiper>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-10">
        
        {/* 2. PROFILE ARTIST SECTION */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Featured Artists</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {artists.map((artist) => (
            <Link key={artist.id} href={`/artist/${artist.id}`} className="flex flex-col items-center min-w-[100px] cursor-pointer group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition">
                <img src={artist.avatar_url || "/default-avatar.png"} alt={artist.name} className="w-full h-full object-cover" />
              </div>
              <span className="mt-2 font-medium text-sm text-gray-700 group-hover:text-blue-600">{artist.name}</span>
            </Link>
          ))}
        </div>

        {/* 3. NEW RELEASE SECTION */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center justify-between">
            New Releases
            <span className="text-sm font-normal text-blue-500 cursor-pointer">View All</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newSeries.map((item) => (
              <Link key={item.id} href={`/series/${item.id}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group">
                <div className="h-60 w-full overflow-hidden bg-gray-200 relative">
                  <img src={item.cover_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded">UP</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 truncate">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{item.artists?.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}