import { canAccessApi, operationGenerationBlurHash } from '@/utils/helper'
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  dbName: 'mdv_media',
  access: {
    read: ({ req }) => true,
    create: ({ req }) => canAccessApi(req),
    update: ({ req }) => canAccessApi(req),
    delete: ({ req }) => canAccessApi(req),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
    },
    {
      name: 'blurhash',
      type: 'text',
      required: false,
      admin: {
        hidden: true,
        disableListColumn: true,
        disableListFilter: true,
      },
    },
  ],
  hooks: {
    beforeValidate: [operationGenerationBlurHash],
  },
  upload: true,
}
