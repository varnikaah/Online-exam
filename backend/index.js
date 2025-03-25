const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./models/dbCon"); // Import MongoDB connection function

require("dotenv").config();

// Connect to MongoDB
connectDB();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS Configuration
app.use(cors({ origin: "*" }));

// Import Routes
const AllGetRoutes = require("./routes/users/gets");
const AllPostRoutes = require("./routes/users/posts");
const AuthRoutes = require("./routes/users/auth");

app.use("/get", AllGetRoutes);
app.use("/post", AllPostRoutes);
app.use("/auth", AuthRoutes);

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
