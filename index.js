const express = require("express");
const bodyParse = require("body-parser");
const moogooes = require("mongoose");
const cors = require("cors");


require("dotenv").config();

const errorHandler = require("./app/middlewares/errorHandler");
const authRouter = require("./app/routes/auth.routes");
const jobRouter = require("./app/routes/job.routes");
const PORT = process.env.PORT || 5000;
const app = express();



app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));
app.use(cors());

app.use(`${process.env.API_VERSION}/auth`, authRouter);
app.use(`${process.env.API_VERSION}`, jobRouter);

app.use(errorHandler);

moogooes
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    console.log("DB:", result)
    const server = app.listen(PORT, () => {
      console.log(
        `Server has been connected with port http://localhost:${PORT}/api/v1`
      );
    })



  })
  .catch((err) => {
    console.log("err", err);
  });
