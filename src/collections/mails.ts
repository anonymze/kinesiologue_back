import { sendEmail } from '@/emails/email'
import { canAccessApi } from '@/utils/helper'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
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
  endpoints: [
    {
      method: 'post',
      path: '/send',
      handler: async (payloadR) => {
        const data = (await payloadR?.json?.()) as {
          client: string
          rappel: string
          name: string
          type: '180' | 'year'
        } | null

        if (!data?.client || !data?.rappel || !data.name || data?.type)
          return Response.json({}, { status: 400 })

        payloadR.payload.db.create({
          collection: 'mails',
          data: {
            client: data.client,
            rappel: data.rappel,
          },
        })

        await sendEmail({
          to: 'metier.yann@gmail.com',
          subject: 'Rappel de prise de rendez-vous en kinesiologie.',
          text: readFileSync(
            join(
              process.cwd(),
              data.type === '180'
                ? 'src/emails/templates/rappel-180-days.txt'
                : 'src/emails/templates/rappel-year.txt',
            ),
            'utf-8',
          ).replace('{{name}}', data.name),

          html: readFileSync(
            join(
              process.cwd(),
              data.type === '180'
                ? 'src/emails/templates/rappel-180-days.html'
                : 'src/emails/templates/rappel-year.html',
            ),
            'utf-8',
          ).replace('{{name}}', data.name),
        })

        return Response.json({
          message: 'OK',
        })
      },
    },
  ],
  fields: [
    {
      type: 'relationship',
      relationTo: 'clients',
      name: 'client',
      label: 'relation',
      required: true,
      unique: true,
    },
    {
      name: 'rappel',
      label: 'Dernier rappel',
      type: 'date',
      required: true,
    },
  ],
}
