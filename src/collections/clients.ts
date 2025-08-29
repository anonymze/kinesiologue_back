import { canAccessApi } from '@/utils/helper'
import type { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
  slug: 'clients',
  // dbName: 'mdv_media',
  access: {
    read: ({ req }) => true,
    create: ({ req }) => canAccessApi(req),
    update: ({ req }) => canAccessApi(req),
    delete: ({ req }) => canAccessApi(req),
  },
  fields: [
    {
      name: 'lastname',
      label: 'Nom',
      type: 'text',
      required: true,
    },
    {
      name: 'firstname',
      type: 'text',
      label: 'Prénom',
      required: true,
    },
    {
      name: 'origin',
      type: 'select',
      label: 'Cabinet',
      options: [
        {
          label: 'France',
          value: 'france',
        },
        {
          label: 'Suisse',
          value: 'suisse',
        },
      ],
      required: true,
    },
    {
      name: 'birthday',
      type: 'date',
      label: 'Date de naissance',
      required: false,
      admin: {
        date: {
          displayFormat: "dd/MM/yyy",
        },
      },
    },

    {
      name: 'last_visit',
      label: 'Dernière visite',
      type: 'date',
      required: false,
      admin: {
        date: {
          displayFormat: "dd/MM/yyyy HH:mm",
          pickerAppearance: "dayAndTime",
          timeFormat: "HH:mm",
        },
      },
    },
  ],
}
