import { NextResponse } from 'next/server'
import { S3 } from 'aws-sdk'

const r2 = new S3({
	endpoint: process.env.CLOUD_FLARE_STORAGE_URL,
	accessKeyId: process.env.CLOUD_FLARE_ACCESS_KEY_ID,
	secretAccessKey: process.env.CLOUD_FLARE_SECRET_ACCESS_KEY,
	signatureVersion: 'v4',
})

export async function POST(req: Request) {
	try {
		const { fileName, fileType } = await req.json()

		const params = {
			Bucket: process.env.CLOUD_FLARE_STORAGE_BUCKET_NAME,
			Key: `uploads/${Date.now()}-${fileName}`,
			ContentType: fileType,
			ACL: 'public-read',
			Expires: 60, // Link expires in 60 seconds
		}

		const uploadUrl = await r2.getSignedUrlPromise('putObject', params)

		return NextResponse.json({ url: uploadUrl })
	} catch (error) {
		console.error('Upload error:', error)
		return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 })
	}
}
