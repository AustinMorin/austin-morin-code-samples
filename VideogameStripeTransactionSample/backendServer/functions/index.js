const functions = require("firebase-functions");
const app = require("express")();
const cors = require("cors");
const { errorHandle, authenticate } = require("./utils/middleware");

const {
  getGames,
  addGame,
  getGame,
  updateGame,
  deleteGame,
} = require("./handlers/tasks/gaming");

const {
  getSubscription,
  createStripeSubscription,
  createPaymentIntent,
  firstStripePayment,
  cancelStripeSubscription,
  stripeWebhook,
} = require("./handlers/payment");

app.post("/subscription/stripe/webhook", stripeWebhook);

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  })
);

app.use(authenticate);

app.get("/games", getGames);
app.post("/games", addGame);
app.get("/games/:id", getGame);
app.put("/games/:id", updateGame);
app.delete("/games/:id", deleteGame);

app.get("/subscription", getSubscription);

app.get("/subscription/stripe/create", createStripeSubscription);
app.get("/subscription/stripe/paymentIntent", createPaymentIntent);
app.get("/subscription/stripe/cancel", cancelStripeSubscription);
app.post("/subscription/stripe/firstpay", firstStripePayment);

app.use(errorHandle);

exports.api = functions.https.onRequest(app);
