import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { uploadImage, getCardThumbnail } from '$lib/server/cloudinary';
import { uploadWonderPickImage } from '$lib/server/storage';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return json(
                { success: false, error: { code: 'NO_FILE', message: 'No image file provided' } },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Test Cloudinary upload
        const cloudinaryResult = await uploadImage(buffer, {
            folder: 'pokemon-tcg-trader/test',
            tags: ['test-upload'],
            publicId: `test-${Date.now()}`
        });

        // Generate optimized thumbnail URL
        const thumbnailUrl = getCardThumbnail(cloudinaryResult.public_id, 'md');

        // Test S3 upload (using existing function with mock userId)
        const s3Result = await uploadWonderPickImage(file, 'test-user');

        return json({
            success: true,
            data: {
                cloudinary: {
                    url: cloudinaryResult.secure_url,
                    publicId: cloudinaryResult.public_id,
                    thumbnail: thumbnailUrl,
                    size: cloudinaryResult.bytes,
                    dimensions: {
                        width: cloudinaryResult.width,
                        height: cloudinaryResult.height
                    }
                },
                s3: s3Result
            }
        });

    } catch (error) {
        console.error('Upload test error:', error);
        return json(
            { success: false, error: { code: 'UPLOAD_FAILED', message: 'Failed to test upload' } },
            { status: 500 }
        );
    }
};
