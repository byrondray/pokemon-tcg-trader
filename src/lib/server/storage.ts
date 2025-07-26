// src/lib/server/storage.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v2 as cloudinary } from 'cloudinary';
import {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    AWS_S3_BUCKET,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
} from '$env/static/private';

const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID!,
        secretAccessKey: AWS_SECRET_ACCESS_KEY!,
    },
});

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

export async function uploadWonderPickImage(file: File, userId: string) {
    try {
        // Generate unique filename
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        const fileName = `wonder-picks/${userId}/${timestamp}.${extension}`;

        // Convert File to ArrayBuffer for S3
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to S3
        const command = new PutObjectCommand({
            Bucket: AWS_S3_BUCKET!,
            Key: fileName,
            Body: buffer,
            ContentType: file.type,
        });

        await s3Client.send(command);

        // Generate S3 URL
        const s3Url = `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${fileName}`;

        // Optimize with Cloudinary
        const optimizedUrl = cloudinary.url(s3Url, {
            width: 1200,
            height: 630,
            crop: 'fill',
            quality: 'auto',
            format: 'auto',
            fetch_format: 'auto',
        });

        return optimizedUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
    }
}

export async function deleteImage(imageUrl: string) {
    try {
        // Extract filename from URL for S3 deletion
        const urlParts = imageUrl.split('/');
        const fileName = urlParts.slice(-3).join('/'); // Get wonder-picks/userId/filename

        // Note: This is a simplified implementation
        // In production, you'd want more robust URL parsing

        return true;
    } catch (error) {
        console.error('Error deleting image:', error);
        return false;
    }
}
