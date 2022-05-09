import cors from "cors";
import express from "express";
import "express-async-errors";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware.js";
import recommendationRouter from "./routers/recommendationRouter.js";
import testsRouter from "./routers/testRouter.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/recommendations", recommendationRouter);
if (process.env.NODE_ENV === "tests") {
  app.use(testsRouter);
}



app.use(errorHandlerMiddleware);

export default app;
