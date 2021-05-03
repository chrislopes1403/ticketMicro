import Stripe from 'stripe';

//@ts-ignore
export const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion:'2020-08-27',
});
