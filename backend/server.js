const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")

dotenv.config();
connectDB();

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/auth", require("./routes/auth"));
app.use("/api/expenses", require("./routes/expenses"));
app.use("/api/budget", require("./routes/budget"));
app.use("/api/dashboard", require("./routes/dashboard"));

const PORT = process.env.PORT || 8000

app.listen(PORT, () => console.log(`Server is running at ${PORT}`))