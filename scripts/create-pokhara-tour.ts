import mongoose from "mongoose";
import { TourTargetModel } from "../apps/backend/src/model/TourTargetModel";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/srk";

async function createPokhariaTourTarget() {
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
    });

    const savedTour = await pokharaTour.save();
    console.log("✅ Pokhara tour target created successfully!");
    console.log("Tour ID:", savedTour._id);
    console.log("Details:", savedTour);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating tour target:", error);
    process.exit(1);
  }
}

createPokhariaTourTarget();
