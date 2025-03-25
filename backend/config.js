require("dotenv").config();

const config = {
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/onlineexam",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  port: process.env.PORT || 5000,
};

module.exports = config;
