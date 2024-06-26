/** 
  Author: Piera Blum
  Date: 26.06.2024
  Description: Starts the server, connects the database, loads models and routes and processes requests.
*/

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const port = 3000;
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

// Database connection
require("./db");

// Models
require("./models/User");
require("./models/Task");
require("./models/Event.js");

// Routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const calendarRoutes = require("./routes/calendarRoutes");

// Middleware
const requireToken = require("./Middlewares/AuthTokenRequired");

// Body-Parser
app.use(bodyParser.json());

// Console output for debugging
console.log("Loaded API Key in index.js:", process.env.OPENWEATHERMAP_API_KEY);

// Use routes
app.use(authRoutes);
app.use(taskRoutes);
app.use(weatherRoutes);
app.use(calendarRoutes);

// Test route
app.get("/", requireToken, (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

// Swagger UI setup
const swaggerDocument = require("./swagger-output.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
