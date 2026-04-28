import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const goal = formData.get('goal');
    const message = formData.get('message');

    // Here you would typically send an email or save to a database.
    console.log("Received contact form submission:", { name, email, goal, message });

    // For now, we'll just redirect to a success page or return a success response
    // If it's a standard form submission, returning a redirect is common.
    // If it's AJAX, returning JSON is better. We'll return JSON and let the client handle it if we add JS, 
    // but the current form doesn't preventDefault. Let's redirect back to /#contact with a success flag
    
    // For simplicity with vanilla HTML form submission:
    return NextResponse.redirect(new URL('/?success=true#contact', request.url));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
