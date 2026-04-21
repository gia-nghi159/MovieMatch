# API Contract

## 1. Create Room Endpoint
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
| `status` | `string` | The current status of the created room. |

**Example Response:**
```json
{
  "roomID": "A1B2C3",
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

---

## 2. Get Room Endpoint
* **URL:** `/api/room/:roomID`
* **Method:** `GET`
* **Description:** Fetches the current state of a specific room, including the host and the list of participants. Used by the lobby to sync data.

### Path Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| `roomID` | `string` | The 6-character alphanumeric room code. |

**Example Request:**
`GET http://localhost:8000/api/room/A1B2C3`

### Success Response
**Status Code:** `200 OK`

| Field | Type | Description |
| --- | --- | --- |
| `roomID` | `string` | The unique room code. |
| `host` | `string` | The name of the room's host. |
| `participantNumber` | `number` | The total expected number of participants. |
| `participants` | `array` | An array of objects representing users currently in the room. |
| `status` | `string` | The current state of the room (e.g., "waiting"). |

**Example Response:**
```json
{
  "roomID": "A1B2C3",
  "host": "John",
  "participantNumber": 4,
  "participants": [
    {
      "name": "John",
      "role": "host",
      "status": "joined"
    }
  ],
  "status": "waiting"
}
```

### Error Response
**Status Code:** `404 Not Found`

**Scenario:** The provided roomID does not exist in the database.

**Example Response:**
```json
{
  "error": "Room not found"
}
```

**Status Code:** `500 Internal Server Error`

**Scenario:** Database connection failure or internal code crash.

**Example Response:**
```json
{
  "error": "Failed to fetch room"
}
```