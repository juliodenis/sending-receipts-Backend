const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const path = require("path");

// Settings
app.set("port", process.env.PORT || 3001);
// app.use(express.static(path.join(__dirname, "public")));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
// Routes
app.use(require("./routes/index"));
module.exports = app;
