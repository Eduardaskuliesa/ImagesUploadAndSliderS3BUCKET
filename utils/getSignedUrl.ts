"use server"

import {S3Client, PutObjectCommand, ListObjectsCommand} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import crypto from 'crypto'
import mongoose from 'mongoose'

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

const s3 = new S3Client({
    region: process.env.S3_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.S3_BUCKET_ACCESS_KEY!,
        secretAccessKey: process.env.S3_BUCKET_SECRET_ACCESS_KEY!,
    },
})

const accepetedTypes = [
    'image/jpeg',
    'image/png'
]

const maxFileSize = 1024 * 1024 * 4


export async function getSignedULR(type:string, size:number, checksum: string) {

  if(!accepetedTypes.includes(type)){
    return {failure: 'Invalid file Type'}
  }
  if(size > maxFileSize) {
    return {failure: "File too Large"}
  }

  const putObjCommand = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key:generateFileName(),
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum
  })

  const signedURL = await getSignedUrl(s3, putObjCommand, {
    expiresIn: 60, 
  })

  return {succes: {url: signedURL}} 
}