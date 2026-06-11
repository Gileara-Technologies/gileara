# API Reference

Two API endpoints under `/api/`.

---

## `POST /api/contact`

Submits a contact form. Uses standard HTML form data (`formData`).

### Request

- **Content-Type**: `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Sender's full name |
| `email` | string | yes | Sender's email address |
| `goal` | string | yes | Project goal / category |
| `message` | string | yes | Free-text message |

### Response

- **Success**: `302 Redirect` to `/?success=true#contact`
- **Error**: `500` with JSON `{ "error": "Failed to process request" }`

### Notes

Currently logs the submission to `console.log` and redirects. No email/database persistence yet.

---

## `POST /api/schedule`

Creates a Google Calendar event for a consultation booking.

### Request

- **Content-Type**: `application/json`

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Contact name |
| `email` | string | yes | Contact email |
| `goal` | string | yes | Meeting goal / category |
| `message` | string | yes | Additional notes |
| `date` | string | yes | Date in `YYYY-MM-DD` format |
| `time` | string | yes | Time in `HH:MM` (24h) format |

### Response

```json
// Success
{ "success": true }

// Server misconfigured
{ "success": false, "message": "Server configuration incomplete" }

// Validation or API error
{ "success": false, "message": "..." }
```

### Auth Flow

Uses **Google Calendar API v3** with a service account and native `crypto.subtle` JWT:

1. Constructs RS256 JWT assertion using the private key
2. Exchanges assertion for OAuth2 access token
3. Creates a 45-minute calendar event

### curl Example

```bash
curl -X POST https://yourdomain.com/api/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "goal": "software",
    "message": "Looking for help with my startup",
    "date": "2026-06-10",
    "time": "14:00"
  }'
```

---

## `GET /api/schedule`

Healthcheck endpoint to verify environment configuration.

### Response

```json
{
  "ok": true,
  "email": true,
  "key": true,
  "cal": true
}
```

Each boolean field indicates whether the corresponding environment variable is set (`GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_CALENDAR_ID`).
