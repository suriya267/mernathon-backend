const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const connectToDB = require("./db/connection");
const userRoutes = require("./routes/user");
const cartRoutes = require("./routes/cart");
const productRoutes = require("./routes/product");
const reviewRoutes = require("./routes/review");
const wishlistRoutes = require("./routes/wishlist");
const orderRoutes = require("./routes/order");
const emailRoutes = require("./routes/emails");

connectToDB();

const cors = require("cors");
app.use(cors({
  origin:"https://mernathon.netlify.app",
  credentials:true
}));

app.use(express.json());
app.use("/images", express.static("images"));

app.get("/", (req, res) => {
  res.send("server running");
});

app.use("/api/auth", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/product", productRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/subscribe", emailRoutes);

const PORT = 8000;
app.listen(PORT, () => {
  console.log("Server Started at PORT", PORT);
});
