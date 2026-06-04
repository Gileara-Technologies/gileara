export const runtime = 'edge';

function base64url(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const cleaned = pem
    .replace(/^['"]|['"]$/g, '')
    .split('\\n').join('\n')
    .trim();

  const base64 = cleaned
    .replace(/-----BEGIN [\w\s]+ PRIVATE KEY-----/g, '')
    .replace(/-----END [\w\s]+ PRIVATE KEY-----/g, '')
    .replace(/\s/g, '');

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function getAccessToken(clientEmail: string, privateKey: string) {
  const now = Math.floor(Date.now() / 1000);
  const encoder = new TextEncoder();

  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/calendar.events',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const headerB64 = base64url(encoder.encode(JSON.stringify(header)).buffer);
  const payloadB64 = base64url(encoder.encode(JSON.stringify(payload)).buffer);
  const signingInput = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(privateKey),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5' },
    key,
    encoder.encode(signingInput),
  );

  const jwt = `${signingInput}.${base64url(signature)}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }).toString(),
  });

  const data: any = await res.json();
  if (!data.access_token) throw new Error(`OAuth2 error: ${JSON.stringify(data)}`);
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    const body: any = await request.json();
    const { name, email, goal, message, date, time } = body;

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!clientEmail || !privateKey || !calendarId) {
      return Response.json(
        { success: false, message: 'Server configuration incomplete' },
        { status: 500 },
      );
    }

    const accessToken = await getAccessToken(clientEmail, privateKey);

    const start = new Date(`${date}T${time}:00`);
    if (isNaN(start.getTime())) throw new Error(`Invalid date/time: ${date} ${time}`);
    const end = new Date(start.getTime() + 45 * 60000);

    const event = {
      summary: `Meeting Request: ${name} (${goal})`,
      description: `Name: ${name}\nEmail: ${email}\nGoal: ${goal}\n\nMessage:\n${message}\n\nCreated via gileara.com`,
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
    };

    const calRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      },
    );

    if (!calRes.ok) {
      const err = await calRes.json();
      throw new Error(`Calendar API error: ${JSON.stringify(err)}`);
    }

    return Response.json({ success: true });
  } catch (error: any) {
    console.error('Schedule error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
