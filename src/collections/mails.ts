import { canAccessApi } from '@/utils/helper'
import type { CollectionConfig } from 'payload'

export const Mails: CollectionConfig = {
  slug: 'mails',
  admin: {
    hidden: true,
  },
  // dbName: 'mdv_media',
  access: {
    read: ({ req }) => true,
    create: ({ req }) => canAccessApi(req),
    update: ({ req }) => canAccessApi(req),
    delete: ({ req }) => canAccessApi(req),
  },
  fields: [
    {
      type: 'relationship',
      relationTo: 'clients',
      name: 'client',
      label: 'relation',
      required: true,
      unique: true
    },
    {
      name: 'rappel',
      label: 'Dernier rappel',
      type: 'date',
      required: true,
    },
  ],
}
