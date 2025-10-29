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
      price: "$149",
      image: "/mountain-hiking-adventure.png",
    },
    {
      title: "Beach Sunset Experience",
      description: "Relax and enjoy a beautiful sunset on a pristine beach",
      price: "$99",
      image: "/beach-sunset-experience.jpg",
    },
    {
      title: "City Food Tour",
      description: "Discover the best local cuisine and hidden food gems",
      price: "$79",
      image: "/city-food-tour.jpg",
    },
    {
      title: "Scuba Diving Expedition",
      description: "Explore vibrant coral reefs and marine life",
      price: "$199",
      image: "/scuba-diving-expedition.jpg",
    },
  ]

  const benefits = [
    {
      icon: "✓",
      title: "Easy Booking",
      description: "Book your favorite experiences in just a few clicks",
    },
    {
      icon: "✓",
      title: "Best Prices",
      description: "Get exclusive deals and discounts on all experiences",
    },
    {
      icon: "✓",
      title: "Secure Payment",
      description: "Your payment information is always safe and secure",
    },
    {
      icon: "✓",
      title: "24/7 Support",
      description: "Our team is always here to help you",
    },
  ]

  return (
    <>
      <Navbar />
      <main className="bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Discover Amazing Experiences</h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Book unique travel experiences and create unforgettable memories
            </p>
            {!isAuthenticated ? (
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  href="/login"
                  className="bg-white text-primary hover:bg-muted px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-semibold transition-colors border border-white"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <Link
                href="/experiences"
                className="inline-block bg-white text-primary hover:bg-muted px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Explore Experiences
              </Link>
            )}
          </div>
        </section>

        {/* Featured Experiences */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-center">Featured Experiences</h2>
            <p className="text-center text-muted-foreground mb-12">Check out some of our most popular experiences</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 bg-muted">
                    <img
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-bold text-lg">{feature.price}</span>
                      {isAuthenticated && (
                        <Link href="/experiences" className="text-primary hover:text-primary-dark font-semibold">
                          View →
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
        <section className="bg-muted py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Why Choose BookIt?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-primary mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Your Adventure?</h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of travelers who have booked amazing experiences with BookIt
            </p>
            {!isAuthenticated ? (
              <Link
                href="/register"
                className="inline-block bg-white text-primary hover:bg-muted px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Get Started Now
              </Link>
            ) : (
              <Link
                href="/experiences"
                className="inline-block bg-white text-primary hover:bg-muted px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse Experiences
              </Link>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-foreground text-white py-8 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p>&copy; 2025 BookIt. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  )
}
