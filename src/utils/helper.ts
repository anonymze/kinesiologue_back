import config from '@payload-config'
import {
  APIError,
  CollectionBeforeValidateHook,
  getPayload,
  PayloadRequest,
  ValidationError,
} from 'payload'
import { getPlaiceholder } from 'plaiceholder'
import sharp from 'sharp'

export const canAccessApi = (req: PayloadRequest): boolean => {
  if (!req.user) return false
  if (req.user.collection === 'admins') return true
  return false
}

/**
 * Throws error if password strength is not met. Password must have:
 *  - 10 or more characters
 *  - letters
 *  - numbers
 **/
export const validatePassword: CollectionBeforeValidateHook = (payloadRequest) => {
  const { data } = payloadRequest
  if (!data?.password) return

  if (data.password.length < 10)
    throw new ValidationError({
      errors: [
        {
          // @ts-ignore
          message: payloadRequest.req.i18n.translations?.custom.errorlengthPassword,
          // @ts-ignore
          label: payloadRequest.req.i18n.translations?.custom.errorlengthPassword,
          path: 'password',
        },
      ],
    })

  const hasLetters = /[a-zA-Z]/.test(data.password)
  const hasNumbers = /\d/.test(data.password)

  if (!hasLetters) {
    throw new ValidationError({
      errors: [
        {
          // @ts-ignore
          message: payloadRequest.req.i18n.translations?.custom.errorLettersPassword,
          // @ts-ignore
          label: payloadRequest.req.i18n.translations?.custom.errorLettersPassword,
          path: 'password',
        },
      ],
    })
  }

  if (!hasNumbers)
    throw new ValidationError({
      errors: [
        {
          // @ts-ignore
          message: payloadRequest.req.i18n.translations?.custom.errorNumbersPassword,
          // @ts-ignore
          label: payloadRequest.req.i18n.translations?.custom.errorNumbersPassword,
          path: 'password',
        },
      ],
    })
}

export const operationGenerationBlurHash: CollectionBeforeValidateHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' && operation !== 'update') return data
  if (req.file?.mimetype.startsWith('image/')) {
    try {
      const buffer = req.file.data
      const base64 = await generateImageBlurHash(buffer)

      return {
        ...data,
        blurhash: base64,
      }
    } catch (error) {
      throw new APIError('Failed to generate blur data url')
    }
  }

  return {
    ...data,
    blurhash: undefined,
  }
}

export const generateImageBlurHash = async (buffer: Buffer) => {
  // First process the image with Sharp to handle orientation
  const processedBuffer = await sharp(buffer)
    .rotate() // This will automatically rotate based on EXIF orientation
    .toBuffer()

  const { base64 } = await getPlaiceholder(processedBuffer, { size: 32 })
  return base64
}

export const generateVideoBlurHash = async (buffer: Buffer) => {
  // const { base64 } = await getPlaiceholder(buffer, { size: 32 });
  // return base64;
  return undefined
}

// export const validateMedia = async (
//   data: string | undefined,
//   mimeType:
//     | 'image/'
//     | 'video/'
//     | 'application/pdf'
//     | 'sheet'
//     | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' = 'image/',
// ) => {
//   if (!data) return
//   const payload = await getPayload({
//     config,
//   })
//   const file = await payload.findByID({
//     collection: 'media',
//     id: data,
//   })

//   // Handle sheet files (Excel and CSV)
//   if (mimeType === 'sheet') {
//     const isExcel =
//       file.mimeType?.startsWith(
//         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//       ) || file.mimeType?.startsWith('application/vnd.ms-excel')
//     const isCsv = file.mimeType?.startsWith('text/csv')

//     if (!isExcel && !isCsv) {
//       return 'Le fichier doit être un Excel (.xlsx, .xls) ou CSV (.csv).'
//     }
//     return // Valid sheet file
//   }

//   if (file.mimeType?.startsWith(mimeType) === false) {
//     if (mimeType === 'image/') return 'Le fichier doit être une image.'
//     if (mimeType === 'video/') return 'Le fichier doit être une vidéo.'
//     if (mimeType === 'application/pdf') return 'Le fichier doit être un PDF.'
//     if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
//       return 'Le fichier doit être un Excel (.xlsx, .xls).'
//   }
// }
