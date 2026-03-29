import mongoose from "mongoose";

const mongoURL = "mongodb+srv://ankitmaurya:ankit9820@cluster0.iwivpcw.mongodb.net/?appName=Cluster0";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
}, { collection: "users" });

const User = mongoose.model("User", userSchema);

async function upgradeAdminRole() {
  try {
    await mongoose.connect(mongoURL);
    console.log("Connected to MongoDB defaulting DB.");
    
    // Attempt to upgrade admin@example.com
    const result = await User.updateOne(
      { email: "admin@example.com" },
      { $set: { role: "admin" } }
    );
    
    console.log("Upgrade result:", result);
    
    const admin = await User.findOne({ email: "admin@example.com" });
    if(admin) {
        console.log("Successfully retrieved user. New role:", admin.role);
    } else {
        console.log("User admin@example.com not found!");
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

upgradeAdminRole();
