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
    if (!DATABASE_URL) {
      console.error("DATABASE_URL not set");
      process.exit(1);
    }

    await mongoose.connect(DATABASE_URL);
    console.log("✅ Connected to MongoDB");

    // Use raw MongoDB update to bypass Mongoose's timestamp protection
    const result = await TourTargetModel.collection.findOneAndUpdate(
      { destination: "Pokhara" },
      {
        $set: {
          createdAt: new Date("2026-04-18"),
          isActive: true,
        }
      },
      { returnDocument: "after" }
    );

    if (result.value) {
      const tour = result.value;
      console.log("\n✅ Updated Pokhara Tour:");
      console.log("   Created At:", tour.createdAt);
      console.log("   Is Active:", tour.isActive);
      console.log("   Duration:", tour.duration, "days");

      // Calculate remaining days
      const created = new Date(tour.createdAt);
      const deadline = new Date(created.getTime() + tour.duration * 24 * 60 * 60 * 1000);
      const now = new Date();
      const remaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      console.log("\n⏱️ Deadline Calculation:");
      console.log("   Created:", created.toISOString());
      console.log("   Deadline:", deadline.toISOString());
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
