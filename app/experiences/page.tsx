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
      <main className="bg-background min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Explore Experiences</h1>
          <p className="text-muted-foreground mb-12">Choose from our amazing collection of travel experiences</p>

          {error && <div className="bg-error/10 text-error p-4 rounded-lg mb-8">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((experience) => (
              <Link key={experience._id} href={`/experiences/${experience._id}`}>
                <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-105 cursor-pointer h-full">
                  <div className="relative h-64 bg-muted overflow-hidden">
                    <img
                      src={experience.image || "/placeholder.svg"}
                      alt={experience.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ${experience.price}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{experience.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{experience.description}</p>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold">{experience.rating}</span>
                      <span className="text-muted-foreground text-sm">({experience.reviews} reviews)</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                      <span>📍</span>
                      <span>{experience.location}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {experience.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="bg-muted text-foreground text-xs px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                      {experience.amenities.length > 3 && (
                        <span className="bg-muted text-foreground text-xs px-2 py-1 rounded">
                          +{experience.amenities.length - 3} more
                        </span>
                      )}
                    </div>

                    <button className="w-full mt-6 bg-primary hover:bg-primary-dark text-white font-semibold py-2 rounded-lg transition-colors">
                      View Details
                    </button>
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
