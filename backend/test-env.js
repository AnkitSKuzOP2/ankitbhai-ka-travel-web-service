import dotenv from "dotenv";

dotenv.config({
    path: "../.env"
});

console.log("MONGO_URL:", process.env.MONGO_URL || "NOT LOADED");
console.log("JWT_SECRET:", process.env.JWT_SECRET_KEY || "NOT LOADED");
console.log("PORT:", process.env.PORT || "NOT LOADED");
