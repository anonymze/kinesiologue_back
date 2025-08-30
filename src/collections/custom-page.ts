import type { CollectionConfig } from 'payload'

export const CustomPage: CollectionConfig = {
  slug: 'custom',
  labels: {
    singular: 'Mails de rappel',
    plural: 'Mails de rappel',
  },
  admin: {
    group: "Mails",
    components: {
      views: {
        list: {
          Component: "/components/custom-mails-list.tsx"
        }
      },
    },
  },
  access: {
    read: () => true,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [

  ],
}
