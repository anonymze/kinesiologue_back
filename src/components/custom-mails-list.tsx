import { sql } from '@payloadcms/db-vercel-postgres/drizzle'
import { type ListViewServerProps } from 'payload'
import RappelSection from './rappel-section'

export default async function MyCustomServerListView({ payload }: ListViewServerProps) {
  // Calculate date thresholds
  const today = new Date()
  const oneYearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000)
  const sixMonthsAgo = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000)

  const usersNeedsToBeRelanced = await payload.db.drizzle.execute(sql`
    SELECT DISTINCT c.*
    FROM clients c
    LEFT JOIN mails m ON c.id = m.client_id
    WHERE (
      (c.last_visit < ${sixMonthsAgo.toISOString()}
       AND c.last_visit >= ${oneYearAgo.toISOString()})
      OR
      (m.rappel < ${sixMonthsAgo.toISOString()}
       AND m.rappel >= ${oneYearAgo.toISOString()})
    )
    AND (m.rappel IS NULL OR m.rappel < ${sixMonthsAgo.toISOString()})
    ORDER BY c.name
  `)

  const oldClients = await payload.db.drizzle.execute(sql`
    SELECT DISTINCT c.*
    FROM clients c
    LEFT JOIN mails m ON c.id = m.client_id
    WHERE c.last_visit < ${oneYearAgo.toISOString()}
    AND (
      m.rappel IS NULL
      OR m.rappel < ${oneYearAgo.toISOString()}
    )
    ORDER BY c.name
  `)

  // All women clients for "Cercle de femmes" - no time limit
  const womenForCercle = await payload.db.drizzle.execute(sql`
    SELECT *
    FROM clients
    WHERE genre = 'femme'
    ORDER BY name
  `)

  // All clients count
  const allClientsCount = await payload.db.count({
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
              {allClientsCount.totalDocs}
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
              {usersNeedsToBeRelanced.rows.length}
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
              {oldClients.rows.length}
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
              Cercle de femmes
            </h3>
            <div
              style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--theme-success-500)' }}
            >
              {womenForCercle.rows.length}
            </div>
          </div>
        </div>

        <RappelSection
          title="Envoi de rappels (180 jours d'absence)"
          clients={usersNeedsToBeRelanced.rows}
          type="180"
        />

        <RappelSection
          title="Envoi de rappels (1 an d'absence)"
          clients={oldClients.rows}
          type="year"
        />

        <RappelSection
          title="Cercle de femmes - Notification"
          clients={womenForCercle.rows}
          type="cercle"
        />
      </div>
    </div>
  )
}
