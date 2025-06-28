const express = require("express");
const app = express();
const DB = require("./config/db.js");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const authRouter = require("./routes/auth.js");
const taskRouter = require("./routes/task.js");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://task-manager-fawn-mu.vercel.app/",
    credentials: true,
  })
);
app.use("/", authRouter);
app.use("/tasks", taskRouter);

DB()
  .then(() => {
    console.log("DB connected ");
    app.listen(PORT, () => {
      console.log("App is listening on port 5000");
    });
  })
  .catch((err) => {
    console.error(err);
  });
