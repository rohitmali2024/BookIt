"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { bookingAPI } from "@/lib/api"
import Link from "next/link"

interface Booking {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  totalPrice: number
  promoCode?: string
  discount: number
  status: string
  experienceId: {
    title: string
    location: string
  }
}

export default function BookingResultPage() {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string
  const status = searchParams.get("status")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchBooking = async () => {
      try {
        const response = await bookingAPI.getMyBookings()
        const foundBooking = response.data.find((b: Booking) => b._id === id)
        if (foundBooking) {
          setBooking(foundBooking)
        } else {
          setError("Booking not found")
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch booking")
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [id, isAuthenticated, router])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Loading booking details...</p>
        </div>
      </>
    )
  }

  const isSuccess = status === "success" && booking

  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg shadow-md p-8 text-center">
            {isSuccess ? (
              <>
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-success/20 rounded-full mb-4">
                    <span className="text-4xl text-success">✓</span>
                  </div>
                </div>

                <h1 className="text-4xl font-bold mb-2 text-success">Booking Confirmed!</h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Your booking has been successfully confirmed. Check your email for details.
                </p>

                {booking && (
                  <div className="bg-muted rounded-lg p-8 text-left mb-8">
                    <h2 className="text-2xl font-bold mb-6">Booking Details</h2>

                    <div className="space-y-4 mb-6 pb-6 border-b border-border">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Booking ID</span>
                        <span className="font-semibold font-mono">{booking._id.slice(-8).toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Experience</span>
                        <span className="font-semibold">{booking.experienceId.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-semibold">{booking.experienceId.location}</span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6 pb-6 border-b border-border">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-semibold">
                          {new Date(booking.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-semibold">{booking.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Guests</span>
                        <span className="font-semibold">{booking.guests}</span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6 pb-6 border-b border-border">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Guest Name</span>
                        <span className="font-semibold">
                          {booking.firstName} {booking.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-semibold">{booking.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-semibold">{booking.phone}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {booking.discount > 0 && (
                        <div className="flex justify-between text-success">
                          <span className="text-muted-foreground">Discount Applied</span>
                          <span className="font-semibold">-${booking.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total Amount</span>
                        <span className="font-bold text-primary">${booking.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 justify-center flex-wrap">
                  <Link
                    href="/experiences"
                    className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Book Another Experience
                  </Link>
                  <Link
                    href="/my-bookings"
                    className="bg-secondary hover:bg-secondary/80 text-foreground px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    View My Bookings
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-error/20 rounded-full mb-4">
                    <span className="text-4xl text-error">✕</span>
                  </div>
                </div>

                <h1 className="text-4xl font-bold mb-2 text-error">Booking Failed</h1>
                <p className="text-lg text-muted-foreground mb-8">
                  {error || "Something went wrong with your booking."}
                </p>

                <div className="flex gap-4 justify-center flex-wrap">
                  <Link
                    href="/experiences"
                    className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Back to Experiences
                  </Link>
                  <Link
                    href="/"
                    className="bg-secondary hover:bg-secondary/80 text-foreground px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Go Home
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
