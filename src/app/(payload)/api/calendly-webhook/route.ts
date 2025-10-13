import type { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

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
    console.log('User-Agent:', userAgent)
    console.log('Has Signature:', !!signature)
    console.log('Event Type:', body.event)
    console.log('================================')

    // Basic security: check if it looks like it's from Calendly
    if ((userAgent && !userAgent.includes('Calendly')) || !signature) {
      throw new Error('Wrong header')
    }

    // Handle invitee.created event
    if (body.event === 'invitee.created') {
      console.log('✅ New appointment booked!')

      const name = body.payload?.name
      const email = body.payload?.email
      const startTime = body.payload?.scheduled_event?.start_time

      if (!name || !email || !startTime) {
        throw new Error('Missing required fields')
      }

      console.log('Name:', name)
      console.log('Email:', email)
      console.log('Start time:', startTime)

      // Get Payload instance
      const payload = await getPayload({ config })

      // Check if client exists by email
      const existingClients = await payload.find({
        collection: 'clients',
        where: {
          email: {
            equals: email,
          },
        },
        limit: 1,
      })

      if (existingClients.docs.length > 0) {
        // Client exists - update last_visit
        const clientId = existingClients.docs[0].id
        await payload.update({
          collection: 'clients',
          id: clientId,
          data: {
            last_visit: startTime,
          },
        })
        console.log(`✅ Updated existing client ${clientId} - last_visit: ${startTime}`)
      } else {
        // Client doesn't exist - create new one
        const newClient = await payload.create({
          collection: 'clients',
          data: {
            name,
            email,
            origin: 'suisse', // default value
            last_visit: startTime,
          },
        })
        console.log(`✅ Created new client ${newClient.id}`)
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error processing Calendly webhook:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
