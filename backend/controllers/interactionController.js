import Interaction from "../models/Interaction.js";

export const logInteraction = async (req, res) => {
  try {
    const { userId, tourId, action, meta } = req.body;
    const inter = new Interaction({ userId, tourId, action, meta });
    await inter.save();
    res.status(201).json({ message: "logged" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to log interaction" });
  }
};
