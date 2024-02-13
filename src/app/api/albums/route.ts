
import { S3Client, ListObjectsCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import connectToDB from '@/utils/mongoose';
import AlbumTest from '../../../models/imageTestSchema'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { S3 } from 'aws-sdk'
import multer from 'multer';
import { url } from 'inspector';


const s3 = new S3Client({
    region: process.env.S3_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.S3_BUCKET_ACCESS_KEY!,
        secretAccessKey: process.env.S3_BUCKET_SECRET_ACCESS_KEY!,
    },
})

const Bucket = process.env.S3_BUCKET_NAME
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')


export const POST = async(req: NextRequest) => {
   await connectToDB()
   const formData = await req.formData();
   const files = formData.getAll("file") as File[];
   const name = formData.get('name')
   const date = formData.get('date')

  // const response = await Promise.all(
  //   files.map(async (file) => {
  //     const Body = (await file.arrayBuffer()) as Buffer;
  //     const FileName = generateFileName()
  //     console.log(FileName)
  //     const putObjCommand = new PutObjectCommand({
  //       Bucket,
  //       Key:FileName,
  //       Body
  //     })
  //   await s3.send(putObjCommand);
  //   const url = `https://${Bucket}.s3.amaonaws.com/${FileName}`
  //   console.log(url);
  //   return url
  //   })
  // );

  const presignedUrls = await Promise.all(
    files.map(async (_) => {
      const FileName = generateFileName();

      const command = new PutObjectCommand({
        Bucket,
        Key: FileName
      });
      const url = await getSignedUrl(s3, command, {expiresIn: 3600});

      
      return {
        fileName: FileName,
        url,
      }
    })
  )
  
  const results = await Promise.all(presignedUrls);

  const images: {
    url: any;
  }[] = [];

  results.forEach((result) =>
    images.push({
      url: result.url.split('?')[0]
    })
  );

  const album = await AlbumTest.create({
    name,
    date,
    images
  })

  console.log(album)

   return NextResponse.json({response: presignedUrls})
}


export const GET = async () => {
  try {
    await connectToDB();
    const albums = await AlbumTest.find().sort({ date: -1 });
    return NextResponse.json({ albums });
  } catch (error) {
    console.log("album/get");
    return NextResponse.json({ error: "Unable to Load" }, { status: 404 });
  }
};