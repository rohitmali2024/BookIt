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
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string

  // read price-related values from query (passed from experience page)
  const guestsParam = Number(searchParams.get("guests") || "1")
  const unitPriceParam = searchParams.get("unitPrice")
  const subtotalParam = searchParams.get("subtotal")
  const taxesParam = searchParams.get("taxes")
  const totalParam = searchParams.get("total")

  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [promoError, setPromoError] = useState("")
  const [discount, setDiscount] = useState(0)

  const { isAuthenticated, user } = useAuth()

  // Use states for qty and all pricing values — prefer query params if provided
  const [qty, setQty] = useState<number>(guestsParam)
  const [unitPrice, setUnitPrice] = useState<number | null>(
    unitPriceParam ? Number(unitPriceParam) : null,
  )
  const [subtotal, setSubtotal] = useState<number | null>(
    subtotalParam ? Number(subtotalParam) : null,
  )
  const [taxes, setTaxes] = useState<number>(taxesParam ? Number(taxesParam) : 59)
  const [total, setTotal] = useState<number | null>(totalParam ? Number(totalParam) : null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      setEmail(user.email)
      setFullName(user.name)
    }

    const fetchExperience = async () => {
      try {
        const response = await experienceAPI.getById(id)
        const exp = response.data
        setExperience(exp)

        // If price values not supplied via query, compute and set them now
        if (unitPrice === null) {
          setUnitPrice(exp.price)
        }
        if (subtotal === null) {
          setSubtotal(exp.price * qty)
        }
        if (total === null) {
          const computedTaxes = taxes ?? 59
          setTotal((subtotal ?? exp.price * qty) - discount + computedTaxes)
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch experience")
      } finally {
        setLoading(false)
      }
    }

    fetchExperience()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated, router, user])

  // Recompute totals when qty, discount or unitPrice change (but keep query-provided values unless missing)
  useEffect(() => {
    // if unitPrice missing but experience is available, derive it
    const pricePerGuest = unitPrice ?? experience?.price ?? 0
    const newSubtotal = pricePerGuest * qty
    setSubtotal(newSubtotal)

    const appliedTaxes = taxes ?? 59
    setTotal(newSubtotal - discount + appliedTaxes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qty, unitPrice, discount, experience])

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code")
      return
    }

    try {
      setPromoError("")
      // validate against the displayed subtotal (prefer state)
      const amountToValidate = subtotal ?? (unitPrice ?? experience?.price ?? 0) * qty
      const response = await promoAPI.validate(promoCode, amountToValidate)
      setDiscount(response.data.discount)
    } catch (err: any) {
      setPromoError(err.response?.data?.message || "Invalid promo code")
      setDiscount(0)
    }
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setBookingLoading(true);
  setError("");

  try {
    const bookingData = {
      userId: user?._id,
      experienceId: id,
      fullName,
      email,
      date: searchParams.get("date"),
      time: searchParams.get("time"),
      guests: qty,
      totalPrice: total ?? (subtotal ?? 0) - discount + taxes,
      promoCode: promoCode || undefined,
      discount: discount || 0,
    };

    console.log("Sending booking data:", bookingData);

    const response = await bookingAPI.create(bookingData);

    if (response.data?.booking?._id) {
      router.push(`/booking-result/${response.data.booking._id}?status=success`);
    } else {
      throw new Error("Invalid booking response");
    }
  } catch (err: any) {
    console.error("Booking error:", err);
    if (err.response?.status === 400) {
      setError(err.response.data.message || "Invalid booking request");
    } else if (err.response?.status === 401) {
      router.push("/login");
    } else {
      setError(err.message || "Booking failed");
    }
  } finally {
    setBookingLoading(false);
  }
};

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg text-gray-500">Loading checkout...</p>
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

  const rawDate = searchParams.get("date")
  const formattedDate = rawDate ? new Date(rawDate).toISOString().split("T")[0] : "-"

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white px-6 py-8 md:px-12">
        <div className="max-w-6xl mx-auto">
          <Link
            href={`/experiences/${id}`}
            className="inline-flex items-center text-black text-[15px] font-medium mb-6 hover:opacity-70"
          >
            ← Checkout
          </Link>

          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left section */}
            <div className="flex-1 bg-[#f7f7f7] rounded-xl p-8 space-y-6">
              <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-3 mt-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full mt-2 px-4 py-3 rounded-md bg-[#e6e6e6] focus:outline-none text-gray-900 font-medium"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full mt-2 px-4 py-3 rounded-md bg-[#e6e6e6] focus:outline-none text-gray-900 font-medium"
                      placeholder="test@test.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex gap-3 mt-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="flex-1 px-4 py-3 rounded-md bg-[#e6e6e6] focus:outline-none text-gray-900 font-medium"
                      placeholder="Promo code"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="bg-black text-white font-medium px-5 py-3 rounded-md hover:bg-gray-800"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-red-500 text-sm mt-1">{promoError}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="terms" required className="accent-black w-4 h-4" />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to the terms and safety policy
                  </label>
                </div>
              </form>
            </div>

            {/* Right section */}
            <div className="lg:w-[420px] bg-[#f7f7f7] rounded-xl p-8 space-y-5">
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Experience</span>
                <span className="text-gray-800 font-semibold">{experience.title}</span>
              </div>

              <div className="flex justify-between text-gray-700 text-sm">
                <span>Date</span>

                <span>{formattedDate}</span>
              </div>
              <div className="flex justify-between text-gray-700 text-sm">
                <span>Time</span>
                <span>{searchParams.get("time") || "-"}</span>
              </div>

              <div className="flex justify-between text-gray-700 text-sm">
                <span>Qty</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="text-lg px-2 border rounded"
                    aria-label="decrease quantity"
                  >
                    −
                  </button>
                  <span>{qty}</span>
                  <button
                    onClick={() => {
                      // cap at availability if possible
                      setQty((q) => q + 1)
                    }}
                    className="text-lg px-2 border rounded"
                    aria-label="increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between text-gray-700 text-sm pt-2">
                <span>Price per guest</span>
                <span>₹{unitPrice ?? experience.price}</span>
              </div>

              <div className="flex justify-between text-gray-700 text-sm pt-2">
                <span>Subtotal</span>
                <span>₹{subtotal ?? 0}</span>
              </div>

              <div className="flex justify-between text-gray-700 text-sm">
                <span>Taxes</span>
                <span>₹{taxes}</span>
              </div>

              <hr className="border-gray-300 my-2" />

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-black">Total</span>
                <span className="text-2xl font-semibold text-black">₹{total ?? 0}</span>
              </div>

              <button
                type="submit"
                form="booking-form"
               
                disabled={bookingLoading}
                className="w-full cursor-pointer bg-[#ffd54f] hover:bg-[#ffca28] text-black font-semibold py-4 rounded-md text-lg mt-4"
              >
                {bookingLoading ? "Processing..." : "Pay and Confirm"}
              </button>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}

