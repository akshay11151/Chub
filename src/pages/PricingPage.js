// src/PricingPage.js
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm.js";
import './Pricing.css';
const stripePromise = loadStripe("pk_test_51RF2o2InQQ5dlp9yBXXBjWTCJLNWzBGFRnzVlGZRRxNY3GY3M5NAUA6EYkXm42ql6vt4KrPFJ0UagbK7N3tiTFdF0029qZ2dhR"); // ⚠️ Replace with your actual Stripe publishable key

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["Access basic features", "Limited support"],
    planId: null, // no Stripe checkout for free
  },
  {
    name: "Pro",
    price: "$10/month",
    features: ["Unlimited access", "Priority support"],
    planId: "pro", // must match backend's plan key
  },
  {
    name: "Enterprise",
    price: "$30/month",
    features: ["Dedicated manager", "Custom integrations"],
    planId: "enterprise",
  },
];

const PricingPage = () => {
  return (
    <div className="pricing-container">
      <h1 className="title">Pricing Plans</h1>
      <div className="cards">
        {plans.map((plan, index) => (
          <div className="card" key={index}>
            <h2>{plan.name}</h2>
            <p>{plan.price}</p>
            <ul>
              {plan.features.map((feature, i) => (
                <li key={i}>✓ {feature}</li>
              ))}
            </ul>
            {plan.planId ? (
              <Elements stripe={stripePromise}>
                <CheckoutForm plan={plan.planId} />
              </Elements>
            ) : (
              <button disabled className="free-button">
                Current Plan
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;

