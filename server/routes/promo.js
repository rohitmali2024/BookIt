import express from "express"
import PromoCode from "../models/PromoCode.js"

const router = express.Router()

// Validate promo code
router.post("/validate", async (req, res) => {
  try {
    const { code, amount } = req.body

    if (!code) {
      return res.status(400).json({ message: "Promo code is required" })
    }

    const promo = await PromoCode.findOne({ code: code.toUpperCase() })

    if (!promo) {
      return res.status(404).json({ message: "Invalid promo code" })
    }

    if (!promo.active) {
      return res.status(400).json({ message: "Promo code is inactive" })
    }

    if (promo.expiryDate && new Date() > promo.expiryDate) {
      return res.status(400).json({ message: "Promo code has expired" })
    }

    if (promo.maxUses && promo.currentUses >= promo.maxUses) {
      return res.status(400).json({ message: "Promo code usage limit reached" })
    }

    let discount = 0
    if (promo.discountType === "percentage") {
      discount = (amount * promo.discountValue) / 100
    } else {
      discount = promo.discountValue
    }

    res.json({
      message: "Promo code is valid",
      discount,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
    })
  } catch (error) {
    res.status(500).json({ message: "Validation failed", error: error.message })
  }
})

export default router
