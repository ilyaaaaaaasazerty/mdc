import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Extract extension or fallback to jpg
    const filenameParts = file.name.split('.');
    const ext = filenameParts.length > 1 ? `.${filenameParts.pop()}` : '.jpg';
    
    // Generate clean unique filename
    const cleanBaseName = filenameParts.join('-').replace(/[^a-zA-Z0-9-]/g, '').slice(0, 20);
    const filename = `${cleanBaseName}-${Date.now()}${ext}`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure the uploads directory exists
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    // Return the relative local path so Next.js <Image> can consume it directly
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: 'Failed to upload' }, { status: 500 });
  }
}
