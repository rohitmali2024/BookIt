"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { bookingAPI } from "@/lib/api"
import Link from "next/link"

interface Booking {
  _id: string
  firstName: string
  lastName: string
  email: string
  date: string
  time: string
  guests: number
  totalPrice: number
  status: string
  experienceId: {
    title: string
    location: string
  }
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchBookings = async () => {
      try {
        const response = await bookingAPI.getMyBookings()
        setBookings(response.data)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [isAuthenticated, router])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Loading your bookings...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground mb-12">View and manage all your bookings</p>

          {error && <div className="bg-error/10 text-error p-4 rounded-lg mb-8">{error}</div>}

          {bookings.length === 0 ? (
            <div className="bg-card rounded-lg shadow-md p-12 text-center">
              <p className="text-lg text-muted-foreground mb-6">You haven't made any bookings yet.</p>
              <Link
                href="/experiences"
                className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Explore Experiences
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-card rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Experience</p>
                      <p className="font-semibold text-lg">{booking.experienceId.title}</p>
                      <p className="text-muted-foreground text-sm">{booking.experienceId.location}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Date & Time</p>
                      <p className="font-semibold">
                        {new Date(booking.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-muted-foreground text-sm">{booking.time}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Guests</p>
                      <p className="font-semibold">{booking.guests}</p>
                    </div>

                    <div className="flex flex-col justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm mb-1">Total Amount</p>
                        <p className="font-semibold text-lg text-primary">${booking.totalPrice.toFixed(2)}</p>
                      </div>
                      <div>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            booking.status === "confirmed" ? "bg-success/20 text-success" : "bg-error/20 text-error"
                          }`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
