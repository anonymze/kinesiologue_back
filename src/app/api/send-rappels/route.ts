import { getPayload } from 'payload'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload()
    const { clientIds, type } = await request.json()

    if (!clientIds || !Array.isArray(clientIds)) {
      return Response.json({ error: 'clientIds array is required' }, { status: 400 })
    }

    const rappelDate = new Date()
    const mailRecords = []

    // Create a mail record for each client
    for (const clientId of clientIds) {
      try {
        const mailRecord = await payload.create({
          collection: 'mails',
          data: {
            cient: clientId, // Note: using 'cient' to match your field name (has typo)
            rappel: rappelDate.toISOString(),
          }
        })
        mailRecords.push(mailRecord)
      } catch (error) {
        console.error(`Failed to create mail record for client ${clientId}:`, error)
      }
    }

    // TODO: Here you would also send the actual emails
    // await sendRappelEmails(clientIds, type)

    return Response.json({ 
      success: true, 
      sent: mailRecords.length,
      type: type,
      rappelDate: rappelDate.toISOString(),
      mailRecords: mailRecords.map(m => ({ id: m.id, client: m.cient, date: m.rappel }))
    })

  } catch (error) {
    console.error('Error sending rappels:', error)
    return Response.json({ 
      error: 'Failed to send rappels',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}