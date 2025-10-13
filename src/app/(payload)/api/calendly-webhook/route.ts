import type { NextRequest } from 'next/server'

export async function GET(_req: NextRequest) {
  return new Response('Calendly webhook endpoint is ready', { status: 200 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Log the webhook event
    console.log('=== Calendly Webhook Received ===')
    console.log('Timestamp:', new Date().toISOString())
    console.log('Event Type:', body.event)
    console.log('Payload:', JSON.stringify(body, null, 2))
    console.log('================================')

    // Verify webhook signature (optional but recommended)
    const signature = req.headers.get('calendly-webhook-signature')
    if (signature) {
      console.log('Webhook signature:', signature)
      // TODO: Verify signature for security
    }

    // Handle different event types
    switch (body.event) {
      case 'invitee.created':
        console.log('New appointment booked!')
        console.log('Invitee:', body.payload?.invitee)
        console.log('Event:', body.payload?.event)
        // TODO: Save to database, send notification, etc.
        break
      
      case 'invitee.canceled':
        console.log('Appointment canceled!')
        console.log('Invitee:', body.payload?.invitee)
        // TODO: Update database, send cancellation notification
        break
      
      default:
        console.log('Unhandled event type:', body.event)
    }
    
    return new Response(JSON.stringify({ received: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error processing Calendly webhook:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
