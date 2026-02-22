const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));//
//app.use(cors());
app.use(cors({ origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
 }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/classes", require("./routes/class"));
app.use("/api/subject", require("./routes/subject"));
app.use("/uploads", express.static("uploads"));
//app.use("/uploads", require("express").static("uploads"));


app.get("/api", (req, res) => {
  res.json({ ok: true, message: "API is working" });
});

app.get("/", (req, res) => {
  res.send("Attendance Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
// made change is "0.0.0.0"