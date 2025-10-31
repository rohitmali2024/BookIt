"use client"

import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function BookingResult() {
  const refId = "HUF56&SO" // dynamically replace with actual ref ID if needed

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-4">
      <div className="flex flex-col items-center space-y-6">
        <CheckCircle className="w-16 h-16 text-green-500" />

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Booking Confirmed</h1>
          <p className="text-gray-500 mt-2 text-base">Ref ID: {refId}</p>
        </div>

        <Link
          href="/"
          className="px-5 py-2.5 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition"
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}

