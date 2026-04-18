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

async function verifyTour() {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      console.error("DATABASE_URL not set");
      process.exit(1);
    }

    await mongoose.connect(DATABASE_URL);
    console.log("✅ Connected to MongoDB");

    // Find Pokhara tour
    const pokhara = await TourTargetModel.findOne({ destination: "Pokhara" });
    
    if (!pokhara) {
      console.log("❌ Pokhara tour not found");
      process.exit(1);
    }

    console.log("\n📍 Pokhara Tour Details:");
    console.log("   Destination:", pokhara.destination);
    console.log("   Duration:", pokhara.duration, "days");
    console.log("   Target Amount:", pokhara.targetAmount);
    console.log("   Is Active:", pokhara.isActive);
    console.log("   Created At:", pokhara.createdAt);
    console.log("   Updated At:", pokhara.updatedAt);

    // Calculate remaining days
    if (pokhara.createdAt && pokhara.duration) {
      const created = new Date(pokhara.createdAt);
      const deadline = new Date(created.getTime() + pokhara.duration * 24 * 60 * 60 * 1000);
      const now = new Date();
      const remaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      console.log("\n⏱️ Deadline Calculation:");
      console.log("   Created:", created.toISOString());
      console.log("   Deadline:", deadline.toISOString());
      console.log("   Now:", now.toISOString());
      console.log("   Days Remaining:", Math.max(remaining, 0));
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

verifyTour();
