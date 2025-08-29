'use client'

import { useState } from 'react'

interface RappelSectionProps {
  title: string
  clients: any[]
  type: "180" | "year"
}

export default function RappelSection({ title, clients, type }: RappelSectionProps) {
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set())

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(e.target.selectedOptions).map(option => option.value)
    setExcludedIds(new Set(selectedIds))
  }

  const handleSendClick = () => {
    const excludedArray = Array.from(excludedIds)
    const clientsToSend = clients.length - excludedIds.size

    console.log(clientsToSend)


  }

  return (
    <section style={{
      marginTop: '3rem',
      background: 'var(--theme-elevation-100)',
      padding: '2rem',
      borderRadius: '12px',
      border: '1px solid var(--theme-elevation-200)'
    }}>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: '600' }}>
        {title}
      </h3>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '500',
          fontSize: '14px'
        }}>
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
            fontSize: '14px'
          }}
        >
          {clients.map((client: any) => (
            <option key={client.id} value={client.id} style={{ paddingBlock: "0.4rem" }}>
              {client.lastname} {client.firstname} - dernière visite : {new Date(client.last_visit).toLocaleDateString('fr-FR')}
            </option>
          ))}
        </select>
        <p style={{
          fontSize: '12px',
          color: 'var(--theme-text-secondary)',
          marginTop: '0.5rem'
        }}>
          💡 Maintenez Ctrl (Cmd sur Mac) pour sélectionner plusieurs clients
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleSendClick}
          style={{
            background: 'var(--theme-success-600)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          Envoyer le rappel
        </button>
      </div>
    </section>
  )
}
