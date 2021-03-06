const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressValidator = require("express-validator");
require("dotenv").config();

// import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const articleRoutes = require("./routes/article");
const articleEntryRoutes = require("./routes/articleEntry");

//app
const app = express();

//database
mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log("DB Connected"));

//middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", articleRoutes);
app.use("/api", articleEntryRoutes);

//defining port
const port = process.env.PORT || 8000;

// listening to the port
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
