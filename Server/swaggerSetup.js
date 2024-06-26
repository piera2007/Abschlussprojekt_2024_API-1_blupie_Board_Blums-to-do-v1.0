/** 
  Author: Piera Blum
  Date: 26.06.2024
  Description: Generates Swagger documentation for the API endpoints defined in the specified files.
*/

const swaggerAutogen = require("swagger-autogen")();
const path = require("path");

const outputFile = path.resolve(__dirname, "swagger-output.json");
const endpointsFiles = [
  path.resolve(__dirname, "routes/authRoutes.js"),
  path.resolve(__dirname, "routes/calendarRoutes.js"),
  path.resolve(__dirname, "routes/taskRoutes.js"),
  path.resolve(__dirname, "routes/weatherRoutes.js"),
];

const doc = {
  info: {
    title: "Your API Title",
    description: "Description of your API",
    version: "1.0.0",
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger documentation has been generated successfully.");
});
