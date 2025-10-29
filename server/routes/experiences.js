import express from "express"
import Experience from "../models/Experience.js"

const router = express.Router()

// Get all experiences
router.get("/", async (req, res) => {
  try {
    const experiences = await Experience.find()
    res.json(experiences)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch experiences", error: error.message })
  }
})

// Get single experience
router.get("/:id", async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id)
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" })
    }
    res.json(experience)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch experience", error: error.message })
  }
})

export default router
