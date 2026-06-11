import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Extract basic fields to demonstrate processing
    const name = formData.get('name');
    const email = formData.get('email');
    const position = formData.get('position');
    const resume = formData.get('resume') as File | null;

    // Basic server-side validation
    if (!name || !email || !position || !resume) {
      return NextResponse.json(
        { error: 'Missing required fields or resume document.' },
        { status: 400 }
      );
    }

    // Server-side file size validation (5MB)
    if (resume.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Resume file size exceeds the 5MB limit.' },
        { status: 400 }
      );
    }

    // Log the application for debugging
    console.log(`[Mock API] New application received:
      Name: ${name}
      Email: ${email}
      Position: ${position}
      Resume: ${resume.name} (${Math.round(resume.size / 1024)} KB)
    `);

    // Simulate network delay / processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Return success
    return NextResponse.json(
      { success: true, message: 'Application submitted successfully.' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error processing application:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your application.' },
      { status: 500 }
    );
  }
}
