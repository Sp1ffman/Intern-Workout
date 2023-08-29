const express = require("express");
const app = express();
const morgan = require("morgan");
const userRouter = require("./routes/userRouter");
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/api/login", userRouter);
