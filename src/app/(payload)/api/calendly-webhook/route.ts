import type { NextRequest } from 'next/server'
import { createHmac } from 'crypto'

export async function GET(_req: NextRequest) {
  return new Response('Calendly webhook endpoint is ready', { status: 200 })
}

async function verifyWebhookSignature(
  payload: string,
  signature: string,
  webhookKey: string,
): Promise<boolean> {
  try {
    const hmac = createHmac('sha256', webhookKey)
    hmac.update(payload)
    const expectedSignature = hmac.digest('base64')
    return signature === expectedSignature
  } catch (error) {
    console.error('Error verifying signature:', error)
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const body = JSON.parse(rawBody)
    
    // Verify webhook signature
    const signature = req.headers.get('calendly-webhook-signature')
    const webhookKey = process.env.CALENDLY_WEBHOOK_KEY
    
    if (!webhookKey) {
      console.error('CALENDLY_WEBHOOK_KEY not configured')
      return new Response(JSON.stringify({ error: 'Webhook key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (signature) {
      const isValid = await verifyWebhookSignature(rawBody, signature, webhookKey)
      if (!isValid) {
        console.error('Invalid webhook signature')
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      console.log('✅ Webhook signature verified')
    } else {
      console.warn('⚠️ No signature provided in webhook')
    }
    
    // Log the webhook event
    console.log('=== Calendly Webhook Received ===')
    console.log('Timestamp:', new Date().toISOString())
    console.log('Event Type:', body.event)
    console.log('Payload:', JSON.stringify(body, null, 2))
    console.log('================================')

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
