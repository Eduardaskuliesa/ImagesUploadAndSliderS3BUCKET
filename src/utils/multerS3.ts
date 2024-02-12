import multer from 'multer'
import multerS3 from 'multer-s3'
import {S3Client} from '@aws-sdk/client-s3'

const s3 = new S3Client({
    region: process.env.S3_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.S3_BUCKET_ACCESS_KEY!,
        secretAccessKey: process.env.S3_BUCKET_SECRET_ACCESS_KEY!,
    },
})

const s3storage = multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    key: 
})
