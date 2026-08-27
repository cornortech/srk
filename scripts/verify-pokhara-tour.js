const mongoose = require("mongoose");

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

async function verifyPokharaTourTarget() {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/srk";
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const pokharaTour = await TourTargetModel.findOne({ destination: "Pokhara" });
    
    if (pokharaTour) {
      console.log("\n✅ POKHARA TOUR TARGET FOUND!");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("ID:", pokharaTour._id);
      console.log("Destination:", pokharaTour.destination);
      console.log("Description:", pokharaTour.description);
      console.log("Target Amount: ₹" + pokharaTour.targetAmount.toLocaleString());
      console.log("Current Amount: ₹" + pokharaTour.currentAmount.toLocaleString());
      console.log("Duration:", pokharaTour.duration + " days");
      console.log("Accommodation:", pokharaTour.accommodation);
      console.log("Difficulty:", pokharaTour.difficulty);
      console.log("Rating:", pokharaTour.rating + "/5");
      console.log("Image URL:", pokharaTour.image);
      console.log("Features:", pokharaTour.features.join(", "));
      console.log("Created:", pokharaTour.createdAt);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    } else {
      console.log("❌ Pokhara tour target not found in database");
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

verifyPokharaTourTarget();
