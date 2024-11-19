const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;


app.use(cors());
app.use(bodyParser.json());


app.post("/submit-form", (req, res) => {
  console.log("Form Data Received:", req.body); 
  res.status(200).send({ message: "Form data received successfully" });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
