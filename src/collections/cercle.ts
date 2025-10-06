import type { GlobalConfig } from 'payload'

export const Cercle: GlobalConfig = {
  slug: 'cercle',
  admin: {
    group: "Travail",
  },
  access: {
    read: ({ req }) => true,
  },
  label: 'Cercle de femmes',
  fields: [
    {
      name: 'flyer',
      type: 'upload',
      label: 'Flyer',
      required: true,
      relationTo: 'media',
    },
  ],
}
