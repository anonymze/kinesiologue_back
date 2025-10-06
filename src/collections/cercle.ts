import type { GlobalConfig } from 'payload'

export const Cercle: GlobalConfig = {
  slug: 'cercle',
  admin: {
    group: "Travail",
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
