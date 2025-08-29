import { type ListViewServerProps } from 'payload'
import RappelSection from './rappel-section'
import { Client } from '@/payload-types'

export default async function MyCustomServerListView({ payload }: ListViewServerProps) {
  // Calculate date thresholds
  const today = new Date()
  const oneYearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000)
  const sixMonthsAgo = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000)

  // Clients to relaunch (between 180 days and 1 year)
  const usersNeedsToBeRelanced = await payload.db.find({
    collection: 'clients',
    limit: 0,
    sort: 'lastname',
    where: {
      and: [
        {
          last_visit: {
            less_than: sixMonthsAgo.toISOString(),
          },
        },
        {
          last_visit: {
            greater_than_equal: oneYearAgo.toISOString(),
          },
        },
      ],
    },
  })

  // Old clients (more than 1 year)
  const oldClients = await payload.db.find({
    collection: 'clients',
    limit: 0,
    sort: 'lastname',
    where: {
      last_visit: {
        less_than: oneYearAgo.toISOString(),
      },
    },
  })

  // All clients count
  const allClients = await payload.db.count({
    collection: 'clients',
  })

  return (
    <div className="">
      <div style={{ padding: '2rem' }}>
        <h1>📧 Mails de rappel</h1>
        <p>Système de rappels automatiques pour tes clients.</p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            margin: '2rem 0',
          }}
        >
          <div
            style={{
              background: 'var(--theme-elevation-100)',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid var(--theme-elevation-200)',
            }}
          >
            <h3 style={{ marginBottom: '1rem' }}>Clients</h3>
            <div
              style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--theme-success-500)' }}
            >
              {allClients.totalDocs}
            </div>
          </div>

          <div
            style={{
              background: 'var(--theme-elevation-100)',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid var(--theme-elevation-200)',
            }}
          >
            <h3 style={{ marginBottom: '1rem' }}>
              Clients à relancer <span style={{ fontSize: '15px' }}>(180 jours d'absences)</span>
            </h3>
            <div
              style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--theme-success-500)' }}
            >
              {usersNeedsToBeRelanced.docs.length}
            </div>
          </div>
          <div
            style={{
              background: 'var(--theme-elevation-100)',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid var(--theme-elevation-200)',
            }}
          >
            <h3 style={{ marginBottom: '1rem' }}>
              Anciens clients <span style={{ fontSize: '15px' }}>(1 an d'absence)</span>
            </h3>
            <div
              style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--theme-success-500)' }}
            >
              {oldClients.docs.length}
            </div>
          </div>
        </div>

        <RappelSection
          title="📧 Envoi de rappels (180 jours d'absence)"
          clients={usersNeedsToBeRelanced.docs}
          type="180"
        />

        <RappelSection
          title="📧 Envoi de rappels (1 an d'absence)"
          clients={oldClients.docs}
          type="year"
        />
      </div>
    </div>
  )
}
