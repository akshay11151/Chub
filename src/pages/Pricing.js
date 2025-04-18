import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import './Pricing.css';

const stripePromise = loadStripe('your-publishable-key-here');

function PricingPage() {
  return (
    <div className="pricing-page">
      <h1>Choose Your Plan</h1>
      <div className="plans">
        {/* Example Pricing Card */}
        <div className="card">
          <h2>Pro Plan</h2>
          <p>$10 / month</p>
          <ul>
            <li>✓ Feature 1</li>
            <li>✓ Feature 2</li>
          </ul>
          <Elements stripe={stripePromise}>
            <CheckoutForm plan="pro" />
          </Elements>
        </div>
      </div>
    </div>
  );
}

