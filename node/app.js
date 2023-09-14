const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const userRouter = require("./routes/userRouter");
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(cors());
module.exports = app;
