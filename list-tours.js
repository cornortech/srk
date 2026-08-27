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

async function listTours() {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      console.error("DATABASE_URL not set");
      process.exit(1);
    }

    await mongoose.connect(DATABASE_URL);
    console.log("✅ Connected to MongoDB\n");

    const tours = await TourTargetModel.find({});
    
    console.log(`Found ${tours.length} tours:\n`);
    tours.forEach((tour, idx) => {
      console.log(`${idx + 1}. ${tour.destination}`);
      console.log(`   - Duration: ${tour.duration} days`);
      console.log(`   - Target: ${tour.targetAmount}`);
      console.log(`   - Active: ${tour.isActive}`);
      console.log(`   - CreatedAt: ${tour.createdAt}`);
      console.log();
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

listTours();
