// storage-adapter-import-placeholder
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { fr } from '@payloadcms/translations/languages/fr'
import { openapi, swaggerUI } from 'payload-oapi'
import { Admins } from './collections/admins'
import { Media } from './collections/media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  cors: ['*'],
  upload: {
    limits: {
      fileSize: 40000000, // 40MB, written in bytes
    },
  },
  localization: {
    locales: ['fr', 'es', 'en'],
    defaultLocale: 'fr',
  },
  i18n: {
    fallbackLanguage: 'fr',
    supportedLanguages: { fr },
  },
  admin: {
    user: Admins.slug,
    avatar: {
      Component: '/components/settings.tsx',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeLogin: ['/components/before-login.tsx'],
      logout: {
        Button: '/components/logout.tsx',
      },
      graphics: {
        Logo: '/components/logo.tsx',
        Icon: '/components/logo.tsx',
      },
    },

    meta: {
      title: 'MDV Administration',
      description: "Administration pour l'application web MDV",
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/favicon.ico',
        },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          url: '/favicon.ico',
        },
      ],
    },
  },
  collections: [Admins, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: vercelPostgresAdapter({
    // create table for database that is not handled by payload
    // beforeSchemaInit: [
    // 	({ schema, adapter }) => {
    // 		return {
    // 			...schema,
    // 			tables: {
    // 				...schema.tables,
    // 				addedTable: pgTable('added_table', {
    // 					// id: serial('id').notNull(),
    // 					id: uuid('id').defaultRandom().primaryKey(),
    // 				}),
    // 			},
    // 		}
    // 	},
    // ],
    idType: 'uuid',
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
    // Add hooks after schema initialization
    afterSchemaInit: [
      async ({ schema }) => {
        // const relations = ['relations_messages']

        // relations.forEach((relation) => {
        //   const index = Symbol.for(`drizzle:PgInlineForeignKeys`)
        //   // console.log(index);
        //   //@ts-expect-error workaround
        //   const fkeys = schema.relations[relation].table[index]
        //   // Loop through the foreign keys and modify them
        //   //@ts-expect-error workaround
        //   fkeys.forEach((foreignKey) => {
        //     foreignKey.onDelete = 'CASCADE'
        //     foreignKey.onUpdate = 'CASCADE'
        //   })
        // })
        return schema
      },
    ],
  }),
  sharp,
  plugins: [
    payloadCloudPlugin({
      // storage: false,
      // email: false,
      // uploadCaching: false,
    }),
    openapi({
      openapiVersion: '3.0',
      metadata: { title: 'SIMPLY LIFE API', version: '1.0.0' },
    }),
    swaggerUI({}),
    vercelBlobStorage({
      enabled: true, // Optional, defaults to true
      // Specify which collections should use Vercel Blob
      collections: {
        media: {
          disableLocalStorage: true,
          prefix: 'media-simply-life',
        },
      },

      // Token provided by Vercel once Blob storage is added to your Vercel project
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
