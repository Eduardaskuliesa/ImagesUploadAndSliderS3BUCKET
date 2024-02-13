import aws from 'aws-sdk'


const s3Client = new aws.S3({
    region: process.env.S3_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.S3_BUCKET_ACCESS_KEY!,
        secretAccessKey: process.env.S3_BUCKET_SECRET_ACCESS_KEY!,
    },
})

export default s3Client