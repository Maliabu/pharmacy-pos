import { NextRequest, NextResponse } from 'next/server';
import cloudinary from 'cloudinary';

// Set up Cloudinary (v3.x)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Handle POST request to upload image
export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData(); // Retrieve the form data
    const file = formData.get('file'); // Retrieve the file from form data
    const folder = formData.get('folder')?.toString() || 'default'; // Default folder if none is provided

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file uploaded or invalid file type' }, { status: 400 });
    }

    // Prepare the file as a stream (convert the file into a buffer)
    const buffer = await file.arrayBuffer();

    // Set the folder path for the upload
    const folderPath = `uploads/${folder}`; // You can customize this to any folder structure

    // Upload to Cloudinary using stream and folder path
    return new Promise<NextResponse>((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        { 
          resource_type: 'auto', // Automatically detect the file type
          folder: folderPath,    // Specify the folder path where the image will be uploaded
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            reject(new NextResponse(JSON.stringify({ error: 'Upload failed' }), { status: 500 }));
          } else {
            // Successfully uploaded, return the file URL
            resolve(
              new NextResponse(
                JSON.stringify({ fileUrl: result?.secure_url }),
                { status: 200 }
              )
            );
          }
        }
      );

      // Pipe the file buffer to Cloudinary's upload stream
      uploadStream.end(Buffer.from(buffer));
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'An error occurred during the upload' }, { status: 500 });
  }
};
