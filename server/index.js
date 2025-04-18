require("dotenv").config();
const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.post("/create-payment", async (req, res) => {
  const { plan, payment_method } = req.body;

  const priceLookup = {
    pro: 'price_pro_id',
    enterprise: 'price_enterprise_id',
  };

  try {
    const customer = await stripe.customers.create({
      payment_method,
      email: 'user@example.com', // Replace later with actual auth email
      invoice_settings: { default_payment_method: payment_method },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceLookup[plan] }],
      expand: ['latest_invoice.payment_intent'],
    });

    res.send(subscription);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));

