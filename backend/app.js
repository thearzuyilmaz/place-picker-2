// Backend API

import fs from "node:fs/promises";
import bodyParser from "body-parser";
import express from "express";

const app = express();

app.use(express.static("images")); //
app.use(bodyParser.json()); // Ensures that incoming request bodies with JSON content are parsed correctly.

// CORS

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all domains
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  next();
});

// The React frontend can send HTTP requests to these endpoints to retrieve data and display it in the user interface.
// This code defines a GET route handler in an Express.js application for the "/places" endpoint.
app.get("/places", async (req, res) => {
  const fileContent = await fs.readFile("./data/places.json"); // reading JSON
  const placesData = JSON.parse(fileContent); // translating to JS
  res.status(200).json({ places: placesData }); // sending response in JSON
});

app.get("/user-places", async (req, res) => {
  const fileContent = await fs.readFile("./data/user-places.json");
  const places = JSON.parse(fileContent);
  res.status(200).json({ places });
});

// Bu kodda, veri ./data/user-places.json dosyasına kaydediliyor.
app.put("/user-places", async (req, res) => {
  console.log("Gelen veri:", req.body); // Burada req.body'yi konsola yazdırarak içeriğini görebilirsiniz
  const places = req.body; // taking client JS
  await fs.writeFile("./data/user-places.json", JSON.stringify(places)); // translating to JSON
  res.status(200).json({ message: "User places updated!" });
});

// 404
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  res.status(404).json({ message: "404 - Not Found" });
});

app.listen(3000);
