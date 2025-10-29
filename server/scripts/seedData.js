import mongoose from "mongoose"
import Experience from "../models/Experience.js"
import PromoCode from "../models/PromoCode.js"
import dotenv from "dotenv"

dotenv.config()

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/bookit")

    // Clear existing data
    await Experience.deleteMany({})
    await PromoCode.deleteMany({})

    // Create sample experiences
    const experiences = [
      {
        title: "Mountain Hiking Adventure",
        description: "Experience breathtaking mountain views and challenging trails",
        image: "/mountain-hiking-adventure.png",
        location: "Colorado, USA",
        price: 149,
        rating: 4.8,
        reviews: 234,
        amenities: ["Guide", "Equipment", "Lunch", "Photos"],
        slots: [
          { date: new Date("2025-11-15"), time: "08:00 AM", available: 10, booked: 0 },
          { date: new Date("2025-11-15"), time: "02:00 PM", available: 8, booked: 0 },
          { date: new Date("2025-11-16"), time: "08:00 AM", available: 10, booked: 0 },
        ],
      },
      {
        title: "Beach Sunset Experience",
        description: "Relax and enjoy a beautiful sunset on a pristine beach",
        image: "/beach-sunset-experience.jpg",
        location: "Maldives",
        price: 99,
        rating: 4.9,
        reviews: 456,
        amenities: ["Refreshments", "Photography", "Comfortable Seating"],
        slots: [
          { date: new Date("2025-11-15"), time: "05:00 PM", available: 15, booked: 0 },
          { date: new Date("2025-11-16"), time: "05:00 PM", available: 15, booked: 0 },
        ],
      },
      {
        title: "City Food Tour",
        description: "Discover the best local cuisine and hidden food gems",
        image: "/city-food-tour.jpg",
        location: "Bangkok, Thailand",
        price: 79,
        rating: 4.7,
        reviews: 189,
        amenities: ["Local Guide", "Food Tastings", "Drinks"],
        slots: [
          { date: new Date("2025-11-15"), time: "10:00 AM", available: 12, booked: 0 },
          { date: new Date("2025-11-16"), time: "10:00 AM", available: 12, booked: 0 },
        ],
      },
      {
        title: "Scuba Diving Expedition",
        description: "Explore vibrant coral reefs and marine life",
        image: "/images/diving.png",
        location: "Great Barrier Reef, Australia",
        price: 199,
        rating: 4.9,
        reviews: 567,
        amenities: ["Equipment", "Certification", "Instructor", "Underwater Photos"],
        slots: [
          { date: new Date("2025-11-15"), time: "07:00 AM", available: 6, booked: 0 },
          { date: new Date("2025-11-16"), time: "07:00 AM", available: 6, booked: 0 },
        ],
      },
    ]

    await Experience.insertMany(experiences)

    // Create sample promo codes
    const promoCodes = [
      {
        code: "SAVE10",
        discountType: "percentage",
        discountValue: 10,
        maxUses: 100,
        active: true,
      },
      {
        code: "FLAT100",
        discountType: "fixed",
        discountValue: 100,
        maxUses: 50,
        active: true,
      },
      {
        code: "WELCOME20",
        discountType: "percentage",
        discountValue: 20,
        maxUses: 200,
        active: true,
      },
    ]

    await PromoCode.insertMany(promoCodes)

    console.log("Database seeded successfully")
    process.exit(0)
  } catch (error) {
    console.error("Seeding failed:", error)
    process.exit(1)
  }
}

seedData()
