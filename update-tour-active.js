require("dotenv").config();
const mongoose = require("mongoose");

const tourTargetSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  description: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  duration: { type: Number, required: true },
  accommodation: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy" },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  image: { type: String, default: "" },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const TourTargetModel = mongoose.model("TourTarget", tourTargetSchema);

async function updateTourActive() {
  const MONGODB_URI = process.env.DATABASE_URL || process.env.MONGODB_URI || "mongodb://localhost:27017/srk";
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    
    // Update the old tour (Pokhara with 300000 target) to isActive: false
    const oldTour = await TourTargetModel.findOne({ targetAmount: 300000 });
    if (oldTour) {
      oldTour.isActive = false;
      await oldTour.save();
      console.log("✅ Old tour (300000) set to isActive: false");
    }
    
    // Update the new tour (Pokhara with 200000 target) to isActive: true
    const newTour = await TourTargetModel.findOne({ targetAmount: 200000 });
    if (newTour) {
      newTour.isActive = true;
      await newTour.save();
      console.log("✅ New tour (200000) set to isActive: true");
    }
    
    // List all tours
    const allTours = await TourTargetModel.find({});
    console.log(`\n📊 All tours:\n`);
    allTours.forEach((tour) => {
      console.log(`- ${tour.destination} (₹${tour.targetAmount}) - isActive: ${tour.isActive}`);
    });
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

updateTourActive();
