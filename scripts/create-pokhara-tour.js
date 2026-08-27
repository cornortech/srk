require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");

// Define the schema inline
const tourTargetSchema = new mongoose.Schema(
  {
    destination: { type: String, required: true },
    description: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    duration: { type: Number, required: true },
    accommodation: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    image: { type: String, default: "" },
    features: [{ type: String }],
  },
  { timestamps: true }
);

const TourTargetModel = mongoose.model("TourTarget", tourTargetSchema);

async function createPokhariaTourTarget() {
  const MONGODB_URI = process.env.DATABASE_URL || process.env.MONGODB_URI || "mongodb://localhost:27017/srk";
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const pokharaTour = new TourTargetModel({
      destination: "Pokhara",
      description:
        "Experience the breathtaking beauty of Pokhara with stunning lakeside views, mountain vistas, and adventure activities. Explore the serene Fewa Lake, visit Sarangkot for sunrise, and enjoy local culture.",
      targetAmount: 200000,
      duration: 30,
      accommodation: "4-Star Resort",
      difficulty: "Medium",
      rating: 5,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNAyUjYLUwxCDf9_fN0KydXM55ZVzU5weE-Q&s",
      features: [
        "Fewa Lake Boating",
        "Sarangkot Sunrise Trek",
        "Paragliding",
        "Adventure Sports",
        "Local Culture Tour",
        "Mountain Views",
      ],
      isActive: true,
    });

    const savedTour = await pokharaTour.save();
    console.log("✅ Pokhara tour target created successfully!");
    console.log("Tour ID:", savedTour._id);
    console.log("Destination:", savedTour.destination);
    console.log("Target Amount: ₹" + savedTour.targetAmount.toLocaleString());
    console.log("Duration:", savedTour.duration + " days");
    console.log("Difficulty:", savedTour.difficulty);
    console.log("Rating:", savedTour.rating);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating tour target:", error);
    process.exit(1);
  }
}

createPokhariaTourTarget();
