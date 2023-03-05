require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const app = express();

const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

// const corsOptions = {
//   origin: "http://localhost:4200",
//   methods: "GET, POST, PUT ,DELETE ,PATCH",
//   allowedHeaders: "Content-Type, Authorization",
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

// app.use(cors(corsOptions))
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRouter);
app.use("/admin", adminRouter);

mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on("error", () => {
  console.error("error");
});

mongoose.connection.on("open", () => {
  console.log("mongoose connection successful");
});

app.listen(process.env.PORT || 3000);
