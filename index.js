const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/reviews', express.static(path.join(__dirname, 'client/reviews')));
app.use('/booking', express.static(path.join(__dirname, 'client/booking')));
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect('mongodb://localhost:27017/hotelbookingdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', () => console.log("MongoDB Error"));
db.once('open', () => console.log("Connected to MongoDB"));
app.post("/submit-review", (req, res) => {
  const { name, email, phno, review } = req.body;
  const data = { name, email, phno, review, formType: "review" };
  db.collection("users").insertOne(data, (err) => {
    if (err) return res.status(500).send("DB Error");
    console.log(" Review inserted");
    res.redirect("/signup_success.html");
  });
});
app.post("/submit-booking", (req, res) => {
  const {
    name, email, phno, roomtype,
    noofdays
  } = req.body;
  const data = {
    name, email, phno, roomtype,
    noofdays,
    formType: "booking"
  };
  db.collection("users").insertOne(data, (err) => {
    if (err) return res.status(500).send("DB Error");
    console.log("Booking inserted");
    res.redirect("/signup_success.html");
  });
});
app.get("/", (req, res) => {
  res.send(`
    <h2>Hotel Booking System</h2>
    <a href="/reviews">Go to Reviews</a><br>
    <a href="/booking">Go to Booking</a>
  `);
});
app.listen(4000, () => {
  console.log(" Server running on http://localhost:4000");
});
