import { operationGenerationBlurHash } from '@/utils/helper'
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: ({ req }) => true,
    create: ({ req }) => true,
    update: ({ req }) => true,
    delete: ({ req }) => true,
  },
  fields: [
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
  admin: {
    hidden: true,
  },
  upload: true,
}
