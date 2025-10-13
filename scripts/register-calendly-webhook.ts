import 'dotenv/config'

const CALENDLY_API = 'https://api.calendly.com'

interface WebhookSubscription {
  organization: string
  url: string
  events: string[]
  signing_key: string
}

async function getOrganizationUri(): Promise<string> {
  const response = await fetch(`${CALENDLY_API}/users/me`, {
    headers: {
      Authorization: `Bearer ${process.env.CALENDLY_JETON}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get user info: ${response.statusText}`)
  }

  const data = await response.json()
  return data.resource.current_organization
}

async function listWebhooks(organizationUri: string): Promise<any[]> {
  const params = new URLSearchParams({
    organization: organizationUri,
    scope: 'organization',
  })

  const response = await fetch(`${CALENDLY_API}/webhook_subscriptions?${params}`, {
    headers: {
      Authorization: `Bearer ${process.env.CALENDLY_JETON}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to list webhooks: ${response.statusText}`)
  }

  const data = await response.json()
  return data.collection || []
}

async function createWebhook(webhookUrl: string): Promise<void> {
  const organizationUri = await getOrganizationUri()
  console.log('Organization URI:', organizationUri)

  // Check existing webhooks
  const existingWebhooks = await listWebhooks(organizationUri)
  console.log(`\nFound ${existingWebhooks.length} existing webhook(s)`)

  // Check if webhook already exists for this URL
  const existingWebhook = existingWebhooks.find((wh) => wh.callback_url === webhookUrl)
  if (existingWebhook) {
    console.log('\n✅ Webhook already registered!')
    console.log('Webhook URI:', existingWebhook.uri)
    console.log('Callback URL:', existingWebhook.callback_url)
    console.log('Events:', existingWebhook.events)
    console.log('Status:', existingWebhook.state)
    return
  }

  // Create new webhook subscription
  const webhookData: WebhookSubscription = {
    organization: organizationUri,
    url: webhookUrl,
    events: ['invitee.created', 'invitee.canceled'],
    signing_key: process.env.CALENDLY_WEBHOOK_KEY!,
  }

  console.log('\nCreating webhook subscription...')
  console.log('URL:', webhookUrl)
  console.log('Events:', webhookData.events.join(', '))

  const response = await fetch(`${CALENDLY_API}/webhook_subscriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CALENDLY_JETON}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(webhookData),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create webhook: ${response.statusText}\n${error}`)
  }

  const data = await response.json()
  console.log('\n✅ Webhook created successfully!')
  console.log('Webhook URI:', data.resource.uri)
  console.log('Status:', data.resource.state)
}

async function main() {
  const webhookUrl = process.argv[2]

  if (!webhookUrl) {
    console.error('Usage: tsx scripts/register-calendly-webhook.ts <webhook-url>')
    console.error('Example: tsx scripts/register-calendly-webhook.ts https://yourdomain.com/api/calendly-webhook')
    process.exit(1)
  }

  if (!process.env.CALENDLY_JETON) {
    console.error('Error: CALENDLY_JETON not found in environment variables')
    process.exit(1)
  }

  if (!process.env.CALENDLY_WEBHOOK_KEY) {
    console.error('Error: CALENDLY_WEBHOOK_KEY not found in environment variables')
    process.exit(1)
  }

  try {
    await createWebhook(webhookUrl)
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

main()
