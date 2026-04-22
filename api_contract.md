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
  "status": "waiting"
}
```

### Error Response
**Status Code:** `400 Bad Request`
```json
{
  "error": "Host name is required" 
}
```
*Note: Also returns 400 if expected participants < 1.*

**Status Code:** `500 Internal Server Error`
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
`GET /api/room/A1B2C3`

### Success Response
**Status Code:** `200 OK`

| Field | Type | Description |
| --- | --- | --- |
| `roomID` | `string` | The unique room code. |
| `host` | `string` | The name of the room's host. |
| `participantNumber` | `number` | The total expected number of participants. |
| `participants` | `array` | An array of objects representing users currently in the room. |
| `status` | `string` | The current state of the room (e.g., "waiting" or "active"). |
| `movies` | `array` | Array of movie objects (will be empty until the game starts). |

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
  "status": "waiting",
  "movies": []
}
```

### Error Response
**Status Code:** `404 Not Found`
```json
{
  "error": "Room not found"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "error": "Failed to fetch room"
}
```

---

## 3. Join Room Endpoint
* **URL:** `/api/join-room`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`

### Request Payload
| Field | Type | Description |
| ---- | --- | --- |
| `participantName` | `string` | The name of the participant joining the room. |
| `roomID` | `string` | The 6-character alphanumeric room code to join. |

**Example Request:**
```json
{
  "participantName": "Alice",
  "roomID": "A1B2C3"
}
```

### Success Response
**Status Code:** `200 OK`

| Field | Type | Description |
| --- | --- | --- |
| `message` | `string` | Confirmation string. |
| `room` | `object` | The full updated room object. |

**Example Response:**
```json
{
  "message": "Joined successfully",
  "room": {
    "roomID": "A1B2C3",
    "host": "John",
    "participantNumber": 4,
    "participants": [
      { "name": "John", "role": "host", "status": "joined" },
      { "name": "Alice", "role": "guest", "status": "joined" }
    ],
    "status": "waiting",
    "createdAt": "2026-04-19T17:00:00.000Z"
  }
}
```

### Error Responses
| Status Code | Scenario | Response Body |
| --- | --- | --- |
| `400 Bad Request` | Missing or empty `participantName` or `roomID` | `{ "error": "Participant name is required" }` |
| `404 Not Found` | No room exists with that `roomID` | `{ "error": "Room not found" }` |
| `403 Forbidden` | Room has already started (status is not `"waiting"`) | `{ "error": "Room is no longer accepting participants" }` |
| `409 Conflict` | A participant with that name already exists in the room | `{ "error": "A participant with that name is already in this room" }` |
| `500 Internal Server Error` | Database failure or internal crash | `{ "error": "Failed to join room" }` |

---

## Socket.io Events

### Overview
Socket.io is used to push real-time updates to the host's waiting lobby whenever a new participant joins. Both the host and each guest must emit `join-socket-room` after landing on the waiting lobby to subscribe to their room's events.

---

### Client → Server: `join-socket-room`
**When to emit:** Immediately after the host or guest lands on the waiting lobby screen.

**Payload:** the roomID string directly (not wrapped in an object)

**Example:**
```js
socket.emit('join-socket-room', 'A1B2C3');
```

---

### Server → Client: `participant-joined`
**When it fires:** Emitted to all sockets in the room's channel whenever `/api/join-room` succeeds.

**Payload:**
| Field | Type | Description |
| --- | --- | --- |
| `participantName` | `string` | The name of the participant who just joined. |
| `participants` | `array` | The full updated participants array for the room. |

**Example:**
```json
{
  "participantName": "Alice",
  "participants": [
    { "name": "John", "role": "host", "status": "joined" },
    { "name": "Alice", "role": "guest", "status": "joined" }
  ]
}
```

The host's waiting lobby should listen for this event and re-render the participant list using the `participants` array.

**Example listener:**
```js
socket.on('participant-joined', ({ participantName, participants }) => {
  // update lobby UI with new participants list
});
```

---

## 4. Start Movie Night (Fetch Movies)
* **URL:** `/api/:roomID/start`
* **Method:** `POST`
* **Description:** Triggered by the host to start the session. Fetches 10 random popular movies from TMDB, saves them to the room, and changes the room status to "active".

### Path Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| `roomID` | `string` | The 6-character alphanumeric room code. |

**Example Request:**
`POST /api/A1B2C3/start`
*(No JSON body required)*

### Success Response
**Status Code:** `200 OK`

| Field | Type | Description |
| --- | --- | --- |
| `movies` | `array` | An array of 10 movie objects for the frontend to display. |

**Example Response:**
```json
{
  "movies": [
    {
      "ID": 533535,
      "title": "Deadpool & Wolverine",
      "posterPath": "[https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg](https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg)",
      "overview": "A listless Wade Wilson toils away in civilian life...",
      "releaseDate": "2024-07-24",
      "voteAverage": 7.7
    }
  ]
}
```

### Error Response
**Status Code:** `404 Not Found`
```json
{
  "message": "Room not found"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "error": "Failed to fetch movies"
}
```

---

## 5. Submit Vote 
* **URL:** `/api/:roomID/vote`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
* **Description:** Submits a user's like or dislike for a specific movie, updating the database counters.

### Path Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| `roomID` | `string` | The 6-character alphanumeric room code. |

### Request Payload
| Field | Type | Description |
| --- | --- | --- |
| `movieID` | `number` | The TMDB ID of the movie being voted on. |
| `voteType` | `string` | Must be exactly `"like"` or `"dislike"`. |

**Example Request:**
```json
{
  "movieID": 533535,
  "voteType": "like"
}
```

### Success Response
**Status Code:** `200 OK`

| Field | Type | Description |
| --- | --- | --- |
| `message` | `string` | Success confirmation. |
| `movie` | `object` | The updated movie object containing the new like/dislike counts. |

**Example Response:**
```json
{
  "message": "Vote submitted successfully",
  "movie": {
    "ID": 533535,
    "title": "Deadpool & Wolverine",
    "posterPath": "[https://image.tmdb.org/t/p/w500/8cd](https://image.tmdb.org/t/p/w500/8cd)...",
    "overview": "A listless Wade Wilson...",
    "releaseDate": "2024-07-24",
    "voteAverage": 7.7,
    "likes": 1,
    "dislikes": 0
  }
}
```

### Error Response
**Status Code:** `400 Bad Request`
```json
{
  "error": "Invalid vote type"
}
```

**Status Code:** `404 Not Found`
```json
{
  "error": "Room not found" 
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "error": "Failed to submit vote"
}
```

---

## 6. Get Results
* **URL:** `/api/:roomID/results`
* **Method:** `GET`
* **Description:** Calculates the winner and runner-ups using the sorting algorithm. This endpoint acts as a gatekeeper and will only return the final results once all participants have finished swiping.

### Path Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| `roomID` | `string` | The 6-character alphanumeric room code. |

**Example Request:**
`GET /api/A1B2C3/results`

### Success Response (Voting Finished)
**Status Code:** `200 OK`

| Field | Type | Description |
| --- | --- | --- |
| `winner` | `object` | The movie object that won the vote. |
| `runnerUps` | `array` | An array containing the 2nd and 3rd place movie objects. |

**Example Response:**
```json
{
  "winner": {
    "ID": 575265,
    "title": "Mission: Impossible - The Final Reckoning",
    "likes": 4,
    "dislikes": 0,
    "voteAverage": 7.2
  },
  "runnerUps": [
    {
      "ID": 533535,
      "title": "Deadpool & Wolverine",
      "likes": 3,
      "dislikes": 1,
      "voteAverage": 7.7
    }
  ]
}
```

### Progress Response (Voting in Progress)
**Status Code:** `202 Accepted`

| Field | Type | Description |
| --- | --- | --- |
| `message` | `string` | "Voting in progress" |
| `waitingFor` | `number` | Estimated number of participants still needed to finish. |

**Example Response:**
```json
{
  "message": "Voting in progress",
  "waitingFor": 2
}
```

### Error Response
**Status Code:** `404 Not Found`
```json
{
  "error": "Room not found"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "error": "Failed to calculate results"
}
```