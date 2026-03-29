import express from "express";
import Subscriber from "../models/Subscriber.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address format" });
    }

    const newSub = new Subscriber({ email });
    await newSub.save();

    res.status(200).json({ success: true, message: "Successfully subscribed to newsletter!" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "You are already subscribed!" });
    }
    res.status(500).json({ success: false, message: "Failed to subscribe" });
  }
});

export default router;
