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

## 3. Start Movie Night (Fetch Movies)
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

## 4. Submit Vote 
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
*Note: Also returns 404 with `"error": "Movie not found in this room"` if the movieID doesn't match the array.*

**Status Code:** `500 Internal Server Error`
```json
{
  "error": "Failed to submit vote"
}
```
---
## 5. Get Results
* **URL:** `/api/:roomID/results`
* **Method:** `GET`
* **Description:** Calculates the winner and runner-ups using the sorting algorithm. This endpoint acts as a gatekeeper and will only return the final results once all participants have finished swiping.

### Path Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| `roomID` | `string` | The 6-character alphanumeric room code. |

**Example Request:**
`GET /api/WJ9F77/results`

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
