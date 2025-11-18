require('dotenv').config();
const express = require("express");
const connectDB = require("./config/cfg");
const cors = require("cors");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/catalog', require("./routes/catalogRoute"));

PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`)
});