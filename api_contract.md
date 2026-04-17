# API Contract

## Create Room Endpoint
* **URL:** `/api/create-room`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`

### Request Payload
| Field | Type | Description |
| ---- | --- | --- |
| `hostName` | `string` | The name of the host creating the room. |
| `expectedParticipants` | `number` | The total number of expected participants. |

**Example Request:**
```json
{
  "hostName": "John",
  "expectedParticipants": 4
}
```

### Success Response
**Status Code:** `200 OK`

| Field | Type | Description |
| --- | --- | --- |
| `roomID` | `string` | The generated 6-character alphanumeric room code. |
| `QRCodeURL` | `string` | The base64 data URL of the generated QR code. |
| `status` | `string` | The current status of the created room. |

**Example Response:**
```json
{
  "roomID": "A1B2C3",
  "QRCodeURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "status": "waiting for participants"
}
```

### Error Response
**Status Code:** `500 Internal Server Error`

**Example Response:**
```json
{
  "error": "Failed to create room"
}
```