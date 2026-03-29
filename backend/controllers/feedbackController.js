import Feedback from "../models/Feedback.js";

export const createFeedback = async (req, res) => {
  const newFeedback = new Feedback(req.body);

  try {
    const savedFeedback = await newFeedback.save();

    res.status(200).json({
      success: true,
      message: "Feedback submitted successfully. Thank you!",
      data: savedFeedback,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback. Please try again.",
    });
  }
};
