

"use client"

import Navbar from "@/components/navbar"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function Home() {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      title: "Mountain Hiking Adventure",
      description: "Experience breathtaking mountain views and challenging trails",
      price: "₹149",
      image: "/mountain-hiking-adventure.png",
    },
    {
      title: "Beach Sunset Experience",
      description: "Relax and enjoy a beautiful sunset on a pristine beach",
      price: "₹99",
      image: "/beach-sunset-experience.jpg",
    },
    {
      title: "City Food Tour",
      description: "Discover the best local cuisine and hidden food gems",
      price: "₹79",
      image: "/city-food-tour.jpg",
    },
    {
      title: "Scuba Diving Expedition",
      description: "Explore vibrant coral reefs and marine life",
      price: "₹199",
      image: "/scuba-diving-expedition.jpg",
    },
  ]

  const benefits = [
    { icon: "✓", title: "Easy Booking", description: "Book your favorite experiences in just a few clicks" },
    { icon: "✓", title: "Best Prices", description: "Get exclusive deals and discounts on all experiences" },
    { icon: "✓", title: "Secure Payment", description: "Your payment information is always safe and secure" },
    { icon: "✓", title: "24/7 Support", description: "Our team is always here to help you" },
  ]

  return (
    <>
      <Navbar />
      <main className="bg-white text-black">
        {/* Hero Section */}
        <section className="bg-[#ffd54f] text-black py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Discover Amazing Experiences</h1>
            <p className="text-xl md:text-2xl mb-8 text-black/80">
              Book unique travel experiences and create unforgettable memories
            </p>
            {!isAuthenticated ? (
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  href="/login"
                  className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-white hover:bg-gray-100 text-black px-8 py-3 rounded-lg font-semibold transition-colors border border-black"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <Link
                href="/experiences"
                className="inline-block bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Explore Experiences
              </Link>
            )}
          </div>
        </section>

        {/* Featured Experiences */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-center">Featured Experiences</h2>
            <p className="text-center text-gray-600 mb-12">
              Check out some of our most popular experiences
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                >
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-black font-bold text-lg">From {feature.price}</span>
                      {isAuthenticated && (
                        <Link
                          href="/experiences"
                          className="bg-[#ffd54f] hover:bg-[#ffca28] text-black font-semibold py-2 px-4 rounded-md"
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-[#fffbea] py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Why Choose BookIt?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center bg-white shadow-sm border border-gray-200 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-[#ffd54f] mb-3">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-black text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Your Adventure?</h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of travelers who have booked amazing experiences with BookIt
            </p>
            {!isAuthenticated ? (
              <Link
                href="/register"
                className="inline-block bg-[#ffd54f] text-black hover:bg-[#ffca28] px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Get Started Now
              </Link>
            ) : (
              <Link
                href="/experiences"
                className="inline-block bg-[#ffd54f] text-black hover:bg-[#ffca28] px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse Experiences
              </Link>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#f7f7f7] text-gray-700 py-6 px-4">
          <div className="max-w-7xl mx-auto text-center text-sm">
            <p>© 2025 BookIt. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  )
}
