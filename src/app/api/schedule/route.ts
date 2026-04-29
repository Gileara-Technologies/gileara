import { NextResponse } from 'next/server';
import * as jose from 'jose';

export const runtime = 'edge';

async function getAccessToken(clientEmail: string, privateKey: string) {
  const now = Math.floor(Date.now() / 1000);
  
  // Prepare the private key - handle newlines if they come from env
  const formattedKey = privateKey.replace(/\\n/g, '\n');

  const jwt = await new jose.SignJWT({
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/calendar.events',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  })
    .setProtectedHeader({ alg: 'RS256' })
    .sign(await jose.importPKCS8(formattedKey, 'RS256'));

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data = await response.json();
  if (!data.access_token) {
    throw new Error(`Failed to get access token: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, goal, message, date, time } = body;

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!clientEmail || !privateKey || !calendarId) {
      console.error("Missing Google credentials");
      // Fallback: In a real scenario, you'd send an email here
      return NextResponse.json({ 
        success: false, 
        message: "Credentials missing, please contact support." 
      }, { status: 500 });
    }

    const accessToken = await getAccessToken(clientEmail, privateKey);

    // Construct meeting time
    // Assuming date is YYYY-MM-DD and time is HH:mm
    const startDateTime = new Date(`${date}T${time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 45 * 60000); // 45 min duration

    const event = {
      summary: `Meeting Request: ${name} (${goal})`,
      description: `
        Name: ${name}
        Email: ${email}
        Goal: ${goal}
        
        Message:
        ${message}
        
        (Created via gileara.com)
      `,
      start: {
        dateTime: startDateTime.toISOString(),
      },
      end: {
        dateTime: endDateTime.toISOString(),
      },
      attendees: [{ email }],
    };

    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!calendarResponse.ok) {
      const errorData = await calendarResponse.json();
      throw new Error(`Calendar API Error: ${JSON.stringify(errorData)}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Scheduling error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Failed to schedule meeting" 
    }, { status: 500 });
  }
}
