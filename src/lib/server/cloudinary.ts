import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    bytes: number;
}

export interface CloudinaryTransformOptions {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb';
    quality?: 'auto' | number;
    format?: 'auto' | 'jpg' | 'png' | 'webp';
    gravity?: 'auto' | 'face' | 'center';
}

/**
 * Upload image to Cloudinary with Pokemon TCG optimizations
 */
export async function uploadImage(
    file: string | Buffer,
    options: {
        folder?: string;
        publicId?: string;
        tags?: string[];
        transformation?: CloudinaryTransformOptions;
    } = {}
): Promise<CloudinaryUploadResult> {
    const {
        folder = 'pokemon-tcg-trader',
        publicId,
        tags = ['pokemon-tcg'],
        transformation = {}
    } = options;

    const uploadOptions = {
        folder,
        public_id: publicId,
        tags,
        resource_type: 'image' as const,
        // Auto-optimize images
        quality: 'auto',
        fetch_format: 'auto',
        // Enable progressive JPEG for better loading
        flags: 'progressive',
        // Apply transformations
        ...transformation
    };

    try {
        // Convert Buffer to base64 data URL if needed
        const fileInput = Buffer.isBuffer(file)
            ? `data:image/jpeg;base64,${file.toString('base64')}`
            : file;

        const result = await cloudinary.uploader.upload(fileInput, uploadOptions);
        return {
            public_id: result.public_id,
            secure_url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            resource_type: result.resource_type,
            bytes: result.bytes
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
}

/**
 * Generate optimized image URL with transformations
 */
export function getOptimizedImageUrl(
    publicId: string,
    options: CloudinaryTransformOptions = {}
): string {
    const {
        width,
        height,
        crop = 'fill',
        quality = 'auto',
        format = 'auto',
        gravity = 'auto'
    } = options;

    return cloudinary.url(publicId, {
        width,
        height,
        crop,
        quality,
        format,
        gravity,
        secure: true,
        // Enable responsive images
        responsive: true,
        // Auto-detect device pixel ratio
        dpr: 'auto'
    });
}

/**
 * Generate Pokemon card thumbnail
 */
export function getCardThumbnail(publicId: string, size: 'sm' | 'md' | 'lg' = 'md'): string {
    const dimensions = {
        sm: { width: 150, height: 210 },
        md: { width: 200, height: 280 },
        lg: { width: 300, height: 420 }
    };

    return getOptimizedImageUrl(publicId, {
        ...dimensions[size],
        crop: 'fill',
        quality: 'auto',
        format: 'webp',
        gravity: 'center'
    });
}

/**
 * Generate Wonder Pick image with overlay
 */
export function getWonderPickImage(publicId: string): string {
    return cloudinary.url(publicId, {
        width: 400,
        height: 300,
        crop: 'fill',
        quality: 'auto',
        format: 'webp',
        gravity: 'center',
        // Add Wonder Pick overlay effect
        overlay: {
            font_family: 'Arial',
            font_size: 20,
            font_weight: 'bold',
            text: 'Wonder Pick',
        },
        color: 'white',
        x: 10,
        y: 10
    });
}

/**
 * Delete image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<boolean> {
    try {
        await cloudinary.uploader.destroy(publicId);
        return true;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        return false;
    }
}

/**
 * Upload multiple images in batch
 */
export async function uploadMultipleImages(
    files: Array<{ buffer: Buffer; filename: string }>,
    options: {
        folder?: string;
        tags?: string[];
    } = {}
): Promise<CloudinaryUploadResult[]> {
    const { folder = 'pokemon-tcg-trader', tags = ['pokemon-tcg', 'batch'] } = options;

    const uploadPromises = files.map((file, index) =>
        uploadImage(file.buffer, {
            folder,
            publicId: `${Date.now()}-${index}-${file.filename}`,
            tags
        })
    );

    return Promise.all(uploadPromises);
}

export { cloudinary };
