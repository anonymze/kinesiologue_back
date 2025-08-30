'use client'

import { sendEmail } from '@/emails/email'
import { useState } from 'react'

interface RappelSectionProps {
  title: string
  clients: any[]
  type: '180' | 'year'
}

export default function RappelSection({ title, clients, type }: RappelSectionProps) {
  const [clientsReactive, setClientsReactive] = useState(clients);
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(e.target.selectedOptions).map((option) => option.value)
    setExcludedIds(new Set(selectedIds))
  }

  const handleSendClick = async () => {
    const clientsToSendRappel = clientsReactive.filter((client) => !excludedIds.has(client.id))

    setLoading(true)

    try {
      await Promise.all(
        clientsToSendRappel.map((client) => {
         return fetch('/api/mails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              client: client.id,
              rappel: new Date(),
            }),
          })
        }),
      )

      // await sendEmail({
      //   to: "metier.yann@gmail.com",
      //   subject: "Création de compte Simply Life",
      //   text: readFileSync(
      //     join(
      //       process.cwd(),
      //       `src/emails/templates/${language}/subscription-app-user.txt`,
      //     ),
      //     "utf-8",
      //   ).replace("{{registrationLink}}", fullLink),

      //   html: readFileSync(
      //     join(
      //       process.cwd(),
      //       `src/emails/templates/${language}/subscription-app-user.html`,
      //     ),
      //     "utf-8",
      //   ).replace("{{registrationLink}}", fullLink),
      // });

      setLoading(false);
      setClientsReactive(clientsReactive.filter((client) => excludedIds.has(client.id)))
    } catch (error) {
      setLoading(false);
    }
  }

  return (
    <section
      style={{
        marginTop: '3rem',
        background: 'var(--theme-elevation-100)',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid var(--theme-elevation-200)',
      }}
    >
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: '600' }}>{title}</h3>

      <div style={{ marginBottom: '2rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            fontSize: '14px',
          }}
        >
          🚫 Exclure du rappel :
        </label>
        <select
          multiple
          onChange={handleSelectChange}
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '0.5rem',
            borderRadius: '6px',
            border: '1px solid var(--theme-elevation-300)',
            background: 'white',
            fontSize: '14px',
          }}
        >
          {clientsReactive.map((client: any) => (
            <option key={client.id} value={client.id} style={{ paddingBlock: '0.4rem' }}>
              {client.lastname} {client.firstname} - dernière visite :{' '}
              {new Date(client.last_visit).toLocaleDateString('fr-FR')}
            </option>
          ))}
        </select>
        <p
          style={{
            fontSize: '12px',
            color: 'var(--theme-text-secondary)',
            marginTop: '0.5rem',
          }}
        >
          💡 Maintenez Ctrl (Cmd sur Mac) pour sélectionner plusieurs clients
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          disabled={loading}
          onClick={handleSendClick}
          style={{
            background: loading ? 'var(--theme-success-800)' : 'var(--theme-success-600)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600',

          }}
        >
          {loading ? 'Envoie en cours...' : 'Envoyer le rappel'}
        </button>
      </div>
    </section>
  )
}
