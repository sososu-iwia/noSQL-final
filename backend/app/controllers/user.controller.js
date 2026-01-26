import userModel from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel
      .findById(userId)
      .select(
        "-password -verifyOtp -resetOtp -verifyOtpExpireAt -resetOtpExpireAt -__v -_id",
      );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCurrentUser = async (req, res) => {
  const currentUser = req.user;
  const updateData = req.body;
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      currentUser._id,
      { $set: updateData },
      { new: true },
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
