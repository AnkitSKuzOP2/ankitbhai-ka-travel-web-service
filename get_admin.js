import mongoose from "mongoose";

const mongoURL = "mongodb+srv://ankitmaurya:ankit9820@cluster0.iwivpcw.mongodb.net/tour-booking?retryWrites=true&w=majority&appName=Cluster0";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
}, { collection: "users" });

const User = mongoose.model("User", userSchema);

async function findOrCreateAdmin() {
  try {
    await mongoose.connect(mongoURL);
    console.log("Connected to MongoDB.");
    
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      console.log("Admin found!");
      console.log("Email:", admin.email);
      console.log("Note: password is encrypted. You might not know it.");
      // We can update the password if needed, or create a new one.
      
      // Let's create a known test admin anyway or update this one:
      const bcrypt = await import("bcryptjs");
      const salt = await bcrypt.default.genSalt(10);
      const hash = await bcrypt.default.hash("admin123", salt);
      
      admin.password = hash;
      await admin.save();
      console.log("Updated admin password to: admin123");
    } else {
      console.log("No admin found. Creating one...");
      const bcrypt = await import("bcryptjs");
      const salt = await bcrypt.default.genSalt(10);
      const hash = await bcrypt.default.hash("admin123", salt);
      
      const newAdmin = new User({
        username: "Admin",
        email: "admin@example.com",
        password: hash,
        role: "admin"
      });
      await newAdmin.save();
      console.log("Created logic admin!");
      console.log("Email: admin@example.com");
      console.log("Password: admin123");
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

findOrCreateAdmin();
