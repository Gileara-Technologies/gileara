import { NextResponse } from 'next/server';
import * as jose from 'jose';

export const runtime = 'edge';

async function getAccessToken(clientEmail: string, privateKey: string) {
  const now = Math.floor(Date.now() / 1000);
  
  const formattedKey = privateKey
    .replace(/^['"]|['"]$/g, '') // Remove wrapping quotes
    .split('\\n').join('\n')     // Handle literal \n strings
    .trim();

  try {
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
      }).toString(),
    });

    const data = await response.json();
    if (!data.access_token) {
      throw new Error(`Failed to get access token: ${JSON.stringify(data)}`);
    }
    return data.access_token;
  } catch (err: any) {
    console.error("Token fetch error detail:", err);
    throw err;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, goal, message, date, time } = body;

    // Standard Next.js process.env should work with OpenNext
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    console.log("Debug Info:", {
      hasEmail: !!clientEmail,
      hasKey: !!privateKey,
      keyLength: privateKey?.length,
      hasCalendar: !!calendarId,
      payload: { date, time }
    });

    if (!clientEmail || !privateKey || !calendarId) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Server configuration missing (Check Environment Variables)" 
      }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const accessToken = await getAccessToken(clientEmail, privateKey);

    const startDateTime = new Date(`${date}T${time}:00`);
    if (isNaN(startDateTime.getTime())) {
      throw new Error(`Invalid meeting date/time provided: ${date} ${time}`);
    }

    const endDateTime = new Date(startDateTime.getTime() + 45 * 60000);

    const event = {
      summary: `Meeting: ${name} (${goal})`,
      description: `Name: ${name}\nEmail: ${email}\nGoal: ${goal}\n\nMessage:\n${message}`,
      start: { dateTime: startDateTime.toISOString() },
      end: { dateTime: endDateTime.toISOString() },
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
      throw new Error(`Google Calendar API Error: ${JSON.stringify(errorData)}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("FATAL CRASH:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message || "Internal system error",
      debug: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
