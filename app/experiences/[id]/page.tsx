"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Navbar from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { experienceAPI } from "@/lib/api"
import Link from "next/link"

interface Slot {
  _id: string
  date: string
  time: string
  available: number
  booked: number
}

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
  slots: Slot[]
}

export default function ExperienceDetailsPage() {
  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchExperience = async () => {
      try {
        const response = await experienceAPI.getById(id)
        setExperience(response.data)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch experience")
      } finally {
        setLoading(false)
      }
    }

    fetchExperience()
  }, [id, isAuthenticated, router])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Loading experience details...</p>
        </div>
      </>
    )
  }

  if (!experience) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg text-error">{error || "Experience not found"}</p>
        </div>
      </>
    )
  }

  const handleSelectSlot = (slot: Slot) => {
    if (slot.available - slot.booked > 0) {
      setSelectedSlot(slot)
    }
  }

  const handleProceedToCheckout = () => {
    if (selectedSlot) {
      router.push(
        `/checkout/${experience._id}?slotId=${selectedSlot._id}&date=${selectedSlot.date}&time=${selectedSlot.time}`,
      )
    }
  }

  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/experiences" className="text-primary hover:text-primary-dark mb-6 inline-block">
            ← Back to Experiences
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Experience Details */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg overflow-hidden shadow-md mb-8">
                <div className="relative h-96 bg-muted">
                  <img
                    src={experience.image || "/placeholder.svg"}
                    alt={experience.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-8">
                  <h1 className="text-4xl font-bold mb-4">{experience.title}</h1>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 text-xl">★</span>
                      <span className="font-semibold text-lg">{experience.rating}</span>
                      <span className="text-muted-foreground">({experience.reviews} reviews)</span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>{experience.location}</span>
                    </div>
                  </div>

                  <p className="text-lg text-muted-foreground mb-8">{experience.description}</p>

                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">What's Included</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {experience.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="text-primary text-xl">✓</span>
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Slots Selection */}
              <div className="bg-card rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6">Select Your Date & Time</h2>

                <div className="space-y-4">
                  {experience.slots.map((slot) => {
                    const availableSlots = slot.available - slot.booked
                    const isAvailable = availableSlots > 0
                    const isSelected = selectedSlot?._id === slot._id

                    return (
                      <button
                        key={slot._id}
                        onClick={() => handleSelectSlot(slot)}
                        disabled={!isAvailable}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? "border-primary bg-primary/10"
                            : isAvailable
                              ? "border-border hover:border-primary"
                              : "border-border bg-muted opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">
                              {new Date(slot.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-muted-foreground">{slot.time}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${isAvailable ? "text-success" : "text-error"}`}>
                              {availableSlots > 0 ? `${availableSlots} slots available` : "Sold out"}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg shadow-md p-8 sticky top-8">
                <h3 className="text-2xl font-bold mb-6">Booking Summary</h3>

                <div className="space-y-4 mb-8 pb-8 border-b border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price per person</span>
                    <span className="font-semibold">${experience.price}</span>
                  </div>

                  {selectedSlot && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-semibold">
                          {new Date(selectedSlot.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-semibold">{selectedSlot.time}</span>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  disabled={!selectedSlot}
                  className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors mb-4"
                >
                  Proceed to Checkout
                </button>

                <p className="text-center text-sm text-muted-foreground">
                  {!selectedSlot ? "Select a date and time to continue" : "You won't be charged yet"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
