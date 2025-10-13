import type { NextRequest } from 'next/server'

export async function GET(_req: NextRequest) {
  return new Response('Calendly webhook endpoint is ready', { status: 200 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Check Calendly headers
    const signature = req.headers.get('calendly-webhook-signature')
    const userAgent = req.headers.get('user-agent')
    
    console.log('=== Calendly Webhook Received ===')
    console.log('Timestamp:', new Date().toISOString())
    console.log('User-Agent:', userAgent)
    console.log('Has Signature:', !!signature)
    console.log('Event Type:', body.event)
    console.log('Payload:', JSON.stringify(body, null, 2))
    console.log('================================')
    
    // Basic security: check if it looks like it's from Calendly
    if (userAgent && !userAgent.includes('Calendly')) {
      console.warn('⚠️ Warning: User-Agent does not contain "Calendly"')
    }

    // Handle invitee.created event
    if (body.event === 'invitee.created') {
      console.log('✅ New appointment booked!')
      console.log('Name:', body.payload?.name)
      console.log('Email:', body.payload?.email)
      console.log('Start time:', body.payload?.scheduled_event?.start_time)
      
      // TODO: Save to Payload database
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
