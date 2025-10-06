import type { GlobalConfig } from 'payload'

export const Hours: GlobalConfig = {
  slug: 'hours',
  admin: {
    group: 'Travail',
  },
  access: {
    read: ({ req }) => true,
  },
  label: 'Horaires de travail',
  fields: [
    {
      name: 'main',
      label: 'Horaire principal',
      type: 'text',
      required: true,
    },
    {
      name: 'secondary',
      type: 'text',
      label: 'Horaire secondaire',
      required: false,
    },
  ],
}
