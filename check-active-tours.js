require("dotenv").config();
const mongoose = require("mongoose");

const TourTargetSchema = new mongoose.Schema(
  {
    destination: String,
    description: String,
    targetAmount: Number,
    duration: Number,
    isActive: Boolean,
  },
  { timestamps: true }
);

const TourTargetModel = mongoose.model("TourTarget", TourTargetSchema);

async function checkActiveTours() {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    await mongoose.connect(DATABASE_URL);
    console.log("✅ Connected to MongoDB\n");

    const activeTours = await TourTargetModel.find({ isActive: true });
    
    console.log(`Found ${activeTours.length} ACTIVE tours:\n`);
    activeTours.forEach((tour, idx) => {
      console.log(`${idx + 1}. ${tour.destination}`);
      console.log(`   Description: ${tour.description.substring(0, 80)}...`);
      console.log(`   Target: ₹${tour.targetAmount}`);
      console.log(`   Duration: ${tour.duration} days`);
      console.log();
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

checkActiveTours();
