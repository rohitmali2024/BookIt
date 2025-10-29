import mongoose from "mongoose"

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  amenities: [
    {
      type: String,
    },
  ],
  slots: [
    {
      date: {
        type: Date,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
      available: {
        type: Number,
        required: true,
      },
      booked: {
        type: Number,
        default: 0,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Experience", experienceSchema)
