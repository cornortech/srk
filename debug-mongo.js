const mongoose = require("mongoose");
require('dotenv').config();

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
}, { timestamps: true });

const TourTargetModel = mongoose.model("TourTarget", tourTargetSchema);

async function debug() {
  const MONGODB_URI = process.env.DATABASE_URL || process.env.MONGODB_URI || "mongodb://localhost:27017/srk";
  
  console.log("Using MongoDB URI:", MONGODB_URI.split('@')[0] + "@..." + MONGODB_URI.split('.')[MONGODB_URI.split('.').length - 2]);
  console.log("Database:", new URL(MONGODB_URI).pathname);
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    
    const tours = await TourTargetModel.find({});
    console.log(`\n📊 Total tours found: ${tours.length}\n`);
    
    tours.forEach((tour, index) => {
      console.log(`${index + 1}. ${tour.destination} (ID: ${tour._id})`);
      console.log(`   Target: ₹${tour.targetAmount}, Duration: ${tour.duration}`);
    });
    
    // Try creating a new one with a unique identifier
    console.log("\n🔄 Creating a test tour...");
    const testTour = new TourTargetModel({
      destination: "Test Tour " + Date.now(),
      description: "Test tour at " + new Date().toISOString(),
      targetAmount: 123456,
      duration: 5,
      accommodation: "Test Hotel",
      difficulty: "Medium",
      rating: 3,
      image: "🧪",
      features: ["Test"],
    });
    
    const saved = await testTour.save();
    console.log(`✅ Test tour created with ID: ${saved._id}`);
    
    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

debug();
