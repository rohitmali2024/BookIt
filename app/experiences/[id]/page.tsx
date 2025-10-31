"use client"

import { useEffect, useState, useMemo } from "react"
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

  // NEW: separate selectedDate from selectedSlot so user chooses date first
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // NEW: quantity state and handlers
  const [quantity, setQuantity] = useState<number>(1)

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

  // Derived list of unique dates from slots
  const uniqueDates = useMemo(() => {
    if (!experience) return []
    const map = new Map<string, string>()
    experience.slots.forEach((s) => {
      // normalize date-only string (ISO YYYY-MM-DD)
      const d = new Date(s.date)
      const iso = d.toISOString().slice(0, 10)
      if (!map.has(iso)) map.set(iso, s.date)
    })
    return Array.from(map.keys())
  }, [experience])

  // When a date is selected, clear selectedSlot and reset quantity to 1
  const handleSelectDate = (isoDate: string) => {
    setSelectedDate(isoDate)
    setSelectedSlot(null)
    setQuantity(1)
  }

  // Select a time-slot (slot must match selectedDate)
  const handleSelectTime = (slot: Slot) => {
    // ensure slot date matches selectedDate
    const slotIso = new Date(slot.date).toISOString().slice(0, 10)
    if (selectedDate && slotIso !== selectedDate) return
    setSelectedSlot(slot)
    // ensure quantity doesn't exceed availability
    const maxAvailable = slot.available - slot.booked
    if (quantity > maxAvailable) setQuantity(Math.max(1, maxAvailable))
  }

  const handleDecrease = () => {
    setQuantity((q) => Math.max(1, q - 1))
  }
  const handleIncrease = () => {
    if (selectedSlot) {
      const maxAvailable = selectedSlot.available - selectedSlot.booked
      setQuantity((q) => Math.min(maxAvailable, q + 1))
    } else {
      setQuantity((q) => Math.min(10, q + 1)) // arbitrary cap when slot not selected
    }
  }

  const handleProceedToCheckout = () => {
    if (selectedSlot && experience) {
      const TAXES = 59
      const subtotal = experience.price * quantity
      const total = subtotal + TAXES

      router.push(
        `/checkout/${experience._id}?slotId=${selectedSlot._id}&date=${encodeURIComponent(
          selectedSlot.date,
        )}&time=${encodeURIComponent(selectedSlot.time)}&guests=${quantity}&unitPrice=${encodeURIComponent(
          String(experience.price),
        )}&subtotal=${encodeURIComponent(String(subtotal))}&taxes=${encodeURIComponent(String(TAXES))}&total=${encodeURIComponent(
          String(total),
        )}`,
      )
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg text-gray-500">Loading experience details...</p>
        </div>
      </>
    )
  }

  if (!experience) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg text-red-500">{error || "Experience not found"}</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#fafafa] min-h-screen py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/experiences"
            className="text-gray-700 text-sm hover:text-black inline-flex items-center mb-6"
          >
            ← Details
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <img
                  src={experience.image || "/placeholder.svg"}
                  alt={experience.title}
                  className="w-full h-[340px] object-cover rounded-lg mb-6"
                />

                <h1 className="text-2xl font-semibold text-gray-900 mb-2">{experience.title}</h1>
                <p className="text-gray-600 mb-6 text-[15px] leading-relaxed">
                  Curated small-group experience. Certified guide. Safety first with gear included.
                  Helmet and Life jackets along with an expert will accompany in {experience.title.toLowerCase()}.
                </p>

                {/* Choose Date - use unique dates */}
                <div className="mb-6">
                  <h3 className="text-[15px] font-semibold text-gray-900 mb-3">Choose date</h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueDates.slice(0, 8).map((iso) => {
                      const d = new Date(iso)
                      const formattedDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" })
                      const isSelected = selectedDate === iso
                      return (
                        <button
                          key={iso}
                          className={`px-4 py-2 rounded-md border text-sm transition-all ${isSelected ? "bg-[#FFD43B] border-[#FFD43B] text-black" : "bg-gray-50 border-gray-200 hover:border-[#FFD43B]"}`}
                          onClick={() => handleSelectDate(iso)}
                        >
                          {formattedDate}
                        </button>
                      )
                    })}
                    {uniqueDates.length === 0 && <div className="text-sm text-gray-400">No dates available</div>}
                  </div>
                </div>

                {/* Choose Time - only show times for selectedDate */}
                <div className="mb-6">
                  <h3 className="text-[15px] font-semibold text-gray-900 mb-3">Choose time</h3>
                  <div className="flex flex-wrap gap-2">
                    {!selectedDate && (
                      <div className="w-full text-sm text-gray-500">Please choose a date first</div>
                    )}
                    {selectedDate &&
                      experience.slots
                        .filter((s) => new Date(s.date).toISOString().slice(0, 10) === selectedDate)
                        .map((slot) => {
                          const availableSlots = slot.available - slot.booked
                          const isAvailable = availableSlots > 0
                          const isSelected = selectedSlot?._id === slot._id

                          return (
                            <button
                              key={slot._id}
                              onClick={() => handleSelectTime(slot)}
                              disabled={!isAvailable}
                              className={`px-4 py-2 rounded-md text-sm border transition-all ${isSelected ? "bg-[#FFD43B] border-[#FFD43B] text-black" : isAvailable ? "bg-gray-50 border-gray-200 hover:border-[#FFD43B]" : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"}`}
                            >
                              {slot.time} {!isAvailable && <span className="text-[11px] text-red-500 ml-1">Sold out</span>}
                            </button>
                          )
                        })}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    All times are in IST (GMT +5:30)
                  </p>
                </div>

                {/* About Section */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-gray-500 text-sm">
                  Scenic routes, trained guides, and safety briefing. <span className="italic">Minimum age 10.</span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600 text-sm">Starts at</span>
                  <span className="text-lg font-semibold">₹{experience.price}</span>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600 text-sm">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDecrease}
                      className="text-lg px-2 border rounded cursor-pointer"
                      aria-label="decrease quantity"
                    >
                      −
                    </button>
                    <span className="text-base">{quantity}</span>
                    <button
                      onClick={handleIncrease}
                      className="text-lg px-2 border rounded cursor-pointer"
                      aria-label="increase quantity"
                      disabled={!!selectedSlot && quantity >= selectedSlot.available - selectedSlot.booked}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{experience.price * quantity}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-gray-600">Taxes</span>
                  <span>₹59</span>
                </div>

                <div className="flex justify-between items-center border-t pt-4 mb-4">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-semibold text-gray-900">
                    ₹{experience.price * quantity + 59}
                  </span>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  disabled={!selectedSlot}
                  className="w-full bg-[#FFD43B] cursor-pointer hover:bg-[#f5c518] text-black font-semibold py-2.5 rounded-md transition-all disabled:opacity-50"
                >
                  Confirm
                </button>

                 {/* 
                {selectedSlot && (
                  <div className="mt-3 text-sm text-gray-600">
                    Selected: {new Date(selectedSlot.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {selectedSlot.time}
                    <div className="text-xs text-gray-500">Available: {selectedSlot.available - selectedSlot.booked}</div>
                  </div>
                )} */}

              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
