const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
connectDB();
const classRoutes = require("./routes/class");

app.use(express.json());
//app.use(cors());
app.use(cors({ origin: "*",
  methods: ["GET", "POST"],
 }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/class", classRoutes);


app.get("/", (req, res) => {
  res.send("Attendance Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
// made change is "0.0.0.0"