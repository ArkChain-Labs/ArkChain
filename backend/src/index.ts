import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import riskRouter from "./routes/risk";
import tradeRouter from "./routes/trade";
import transactionsRouter from "./routes/transactions";
import reportsRouter from "./routes/reports";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      /\.railway\.app$/,
    ],
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/risk-check", riskRouter);
app.use("/api/submit-trade", tradeRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/generate-report", reportsRouter);

app.listen(PORT, () => {
  console.log(`ArkChain backend running on port ${PORT}`);
});
