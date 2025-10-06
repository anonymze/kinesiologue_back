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
      name: 'genre',
      label: 'Genre',
      type: 'radio',
      required: true,
      options: [
        {
          label: 'Homme',
          value: 'homme',
        },
        {
          label: 'Femme',
          value: 'femme',
        },
        {
          label: 'Autre',
          value: 'other',
        },
      ],
    },
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
      name: 'email',
      type: 'email',
      label: 'Email',
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
      name: 'age',
      type: 'text',
      label: 'Age',
      required: false,
    },
    {
      name: 'memo',
      type: 'textarea',
      label: 'Mémo',
      required: false,
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
    {
      name: "autres",
      type: "ui",
      admin: {
        components: {
          Field: "/components/description-below-password.tsx",
        },
      },
    },
  ],
}
