const Stripe = require('stripe')
const dotenv = require('dotenv')

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

exports.payment = async (req, res) => {
  const { amount, currency } = req.body

  if (!amount || !currency) {
    return res
      .status(400)
      .json({ message: 'Amount and currency are required!' })
  }

  try {
    // Convert the amount to the desired value
    const convertedAmount = amount 

    // Convert the amount to cents
    const totalAmountInCents = convertedAmount * 100

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'Purchase',
            },
            unit_amount: totalAmountInCents, // Use total amount in cents
          },
          quantity: 1, 
        },
      ],
      success_url: 'http://localhost:3001/success',
      cancel_url: 'http://localhost:3001/cancel',
    })

    res.status(200).json({ url: session.url }) // Return the session URL
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create payment session',
      error: error.message,
    })
  }
}
