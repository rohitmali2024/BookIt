"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { experienceAPI } from "@/lib/api"
import Link from "next/link"

interface Experience {
  _id: string
  title: string
  description: string
  image: string
  location: string
  price: number
  rating: number
  reviews: number
  amenities: string[]
}

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchExperiences = async () => {
      try {
        const response = await experienceAPI.getAll()
        setExperiences(response.data)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch experiences")
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [isAuthenticated, router])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Loading experiences...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#f9f9f9] min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Explore Experiences</h1>
          <p className="text-gray-500 mb-12">
            Choose from our amazing collection of travel experiences
          </p>

          {error && <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-8">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((experience) => (
              <Link key={experience._id} href={`/experiences/${experience._id}`}>
                <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={experience.image || "/placeholder.svg"}
                      alt={experience.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{experience.title}</h3>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">
                        {experience.location}
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm mb-3 leading-snug">
                      Curated small-group experience. Certified guide. Safety first with gear included.
                    </p>

                    <div className="flex justify-between items-center">
                      <p className="text-gray-900 font-semibold text-base">
                        From <span className="font-bold text-black">₹{experience.price}</span>
                      </p>
                      <button className="bg-[#FFD43B] cursor-pointer hover:bg-[#f5c518] text-black font-semibold text-sm px-4 py-2 rounded-md transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

