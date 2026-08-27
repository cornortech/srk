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

async function fixActiveTours() {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    await mongoose.connect(DATABASE_URL);
    console.log("✅ Connected to MongoDB\n");

    // Deactivate the old one
    const deactivated = await TourTargetModel.findOneAndUpdate(
      { destination: "Pokhara", description: "Lets go to pokhara...." },
      { isActive: false },
      { new: true }
    );

    if (deactivated) {
      console.log("✅ DEACTIVATED:");
      console.log(`   ${deactivated.destination} (₹${deactivated.targetAmount})`);
      console.log(`   "${deactivated.description}"`);
    }

    // Activate the correct one
    const activated = await TourTargetModel.findOneAndUpdate(
      { destination: "Pokhara", targetAmount: 200000 },
      { isActive: true },
      { new: true }
    );

    if (activated) {
      console.log("\n✅ ACTIVATED:");
      console.log(`   ${activated.destination} (₹${activated.targetAmount})`);
      console.log(`   "${activated.description.substring(0, 100)}..."`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

fixActiveTours();
