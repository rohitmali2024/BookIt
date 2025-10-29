"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { experienceAPI, bookingAPI, promoAPI } from "@/lib/api"
import Link from "next/link"

interface Experience {
  _id: string
  title: string
  price: number
  location: string
}

export default function CheckoutPage() {
  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)

  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [guests, setGuests] = useState(1)
  const [promoCode, setPromoCode] = useState("")
  const [promoError, setPromoError] = useState("")
  const [discount, setDiscount] = useState(0)
  const [discountType, setDiscountType] = useState("")

  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string
  const date = searchParams.get("date")
  const time = searchParams.get("time")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      setEmail(user.email)
      setFirstName(user.name.split(" ")[0])
      setLastName(user.name.split(" ").slice(1).join(" ") || "")
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
  }, [id, isAuthenticated, router, user])

  const subtotal = experience ? experience.price * guests : 0
  const finalPrice = Math.max(0, subtotal - discount)

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code")
      return
    }

    try {
      setPromoError("")
      const response = await promoAPI.validate(promoCode, subtotal)
      setDiscount(response.data.discount)
      setDiscountType(response.data.discountType)
    } catch (err: any) {
      setPromoError(err.response?.data?.message || "Invalid promo code")
      setDiscount(0)
      setDiscountType("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setBookingLoading(true)

    try {
      if (!firstName || !lastName || !email || !phone || !guests) {
        throw new Error("All fields are required")
      }

      if (!date || !time) {
        throw new Error("Date and time are required")
      }

      const bookingData = {
        experienceId: id,
        firstName,
        lastName,
        email,
        phone,
        date,
        time,
        guests: Number.parseInt(guests.toString()),
        totalPrice: finalPrice,
        promoCode: promoCode || undefined,
        discount,
      }

      const response = await bookingAPI.create(bookingData)

      router.push(`/booking-result/${response.data.booking._id}?status=success`)
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || "Booking failed")
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Loading checkout...</p>
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

  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href={`/experiences/${id}`} className="text-primary hover:text-primary-dark mb-6 inline-block">
            ← Back to Experience
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

                {error && <div className="bg-error/10 text-error p-4 rounded-lg mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information */}
                  <div>
                    <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div>
                    <h2 className="text-xl font-bold mb-4">Booking Details</h2>
                    <div>
                      <label className="block text-sm font-medium mb-2">Number of Guests</label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number.parseInt(e.target.value))}
                        className="w-full"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? "Guest" : "Guests"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div>
                    <h2 className="text-xl font-bold mb-4">Promo Code</h2>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Enter promo code (e.g., SAVE10)"
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="bg-secondary hover:bg-secondary/80 text-foreground font-semibold px-6 py-2 rounded-lg transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && <p className="text-error text-sm mt-2">{promoError}</p>}
                    {discount > 0 && (
                      <p className="text-success text-sm mt-2">✓ Promo applied! You saved ${discount.toFixed(2)}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    {bookingLoading ? "Processing..." : "Complete Booking"}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg shadow-md p-8 sticky top-8">
                <h3 className="text-2xl font-bold mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div>
                    <p className="font-semibold text-lg">{experience.title}</p>
                    <p className="text-muted-foreground text-sm">{experience.location}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span>
                        {date
                          ? new Date(date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span>{time || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guests</span>
                      <span>{guests}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="font-semibold">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">${finalPrice.toFixed(2)}</span>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  You won't be charged until you complete the booking
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
