require("dotenv").config();
const { FINNHUB_TOKEN, SERVER_PORT } = process.env;
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.json("sanity check");
});

app.get("/symbols", async (req, res) => {
  const response = await axios.get(
    `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${FINNHUB_TOKEN}`
  );
  let { data } = response;
  res.json(data);
});

app.get("/target/:symbol", async (req, res) => {
  const { symbol } = req.params;
  const response = await axios.get(
    `https://finnhub.io/api/v1/stock/price-target?symbol=${symbol}&token=${FINNHUB_TOKEN}`
  );
  let { data } = response;
  res.json(data);
});

// get company news
app.get("/news/:symbol", async (req, res) => {
  const { symbol } = req.params;
  const response = await axios.get(
    `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=2020-04-30&to=2020-05-01&token=${FINNHUB_TOKEN}`
  );
  let { data } = response;
  res.json(data);
});

// get current price
app.get("/quote/:symbol", async (req, res) => {
  const { symbol } = req.params;
  const response = await axios.get(
    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_TOKEN}`
  );
  let { data } = response;
  res.json(data);
});

app.listen(SERVER_PORT, () =>
  console.log(`express listening on port ${SERVER_PORT}`)
);
