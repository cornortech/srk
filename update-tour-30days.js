require("dotenv").config();
const mongoose = require("mongoose");

const TourTargetSchema = new mongoose.Schema(
  {
    destination: String,
    targetAmount: Number,
    duration: Number,
    isActive: Boolean,
  },
  { timestamps: true }
);

const TourTargetModel = mongoose.model("TourTarget", TourTargetSchema);

async function fixTour() {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    await mongoose.connect(DATABASE_URL);
    console.log("✅ Connected to MongoDB");

    // Update Pokhara tour: 30 days, created today, active
    const result = await TourTargetModel.collection.updateOne(
      { destination: "Pokhara" },
      {
        $set: {
          duration: 30,
          createdAt: new Date("2026-04-18"),
          isActive: true,
        }
      }
    );

    if (result.modifiedCount > 0) {
      // Fetch updated tour
      const tour = await TourTargetModel.findOne({ destination: "Pokhara" });
      
      console.log("\n✅ Updated Pokhara Tour:");
      console.log("   Duration: 30 days");
      console.log("   Created At:", tour.createdAt);
      console.log("   Is Active:", tour.isActive);

      // Calculate remaining days
      const created = new Date(tour.createdAt);
      const deadline = new Date(created.getTime() + 30 * 24 * 60 * 60 * 1000);
      const now = new Date();
      const remaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      console.log("\n⏱️ Deadline:");
      console.log("   Created:", created.toDateString());
      console.log("   Deadline:", deadline.toDateString());
      console.log("   Days Remaining:", Math.max(remaining, 0));
    } else {
      console.log("❌ Tour not found");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

fixTour();
