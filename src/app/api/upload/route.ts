import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { Logger } from '@/utils/Logger';
import sharp from 'sharp';
import { verifyToken } from '../verify-jwt';

// Check if the file is an image based on MIME type
const isImage = (mimeType: string): boolean => {
  return mimeType.startsWith('image/');
};

export const POST = async (request: Request) => {
  const verified = await verifyToken(request);

  if (!verified) {
    return NextResponse.json(
      { status: 401, error: 'Unauthorized' },
      { status: 401 }
    );
  }
  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      Logger.error(
        `Failed to create uploads directory ${error}`,
        'upload/route.ts'
      );
      return NextResponse.json(
        { status: 500, error: 'Failed to create uploads directory' },
        { status: 500 }
      );
    }

    // Parse the form data from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { status: 400, error: 'File is required' },
        { status: 400 }
      );
    }

    // Read the file contents
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a base filename with timestamp to prevent duplicates
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '-').toLowerCase();

    // Check if file is an image
    if (isImage(file.type)) {
      try {
        // Remove extension from original name to prepare for webp extension
        const nameWithoutExt =
          originalName.substring(0, originalName.lastIndexOf('.')) ||
          originalName;
        const webpFilename = `${timestamp}-${nameWithoutExt}.webp`;
        const webpFilepath = path.join(uploadsDir, webpFilename);

        // Convert to WebP using sharp
        const webpBuffer = await sharp(buffer)
          .webp({ quality: 80 }) // You can adjust quality as needed
          .toBuffer();

        // Write the WebP file
        await writeFile(webpFilepath, webpBuffer);

        // Return success response with WebP file info
        return NextResponse.json({
          message: 'File uploaded and converted to WebP successfully!',
          filename: webpFilename,
          originalName: file.name,
          size: webpBuffer.length,
          path: `/uploads/${webpFilename}`,
          format: 'webp',
        });
      } catch (error) {
        Logger.error(
          `Failed to convert image to WebP: ${error}`,
          'upload/route.ts'
        );
        return NextResponse.json(
          { status: 500, error: 'Failed to process image' },
          { status: 500 }
        );
      }
    } else {
      // For non-image files, save as-is (optional: you could reject non-image files)
      const filename = `${timestamp}-${originalName}`;
      const filepath = path.join(uploadsDir, filename);

      await writeFile(filepath, buffer);

      return NextResponse.json({
        message: 'Non-image file uploaded successfully!',
        filename,
        originalName: file.name,
        size: file.size,
        path: `/uploads/${filename}`,
        format: path.extname(file.name).substring(1),
      });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { status: 500, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
};
