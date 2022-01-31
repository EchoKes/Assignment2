# API Reference (Tutor's Dashboard)

## 1. Ratings

Base URL: `localhost:8181/ratings`

---

### 1.1 GET ratings

This endpoint is used to get all ratings given by tutors to other students.

#### Endpoint URL

`:receiverId` is referencing student's id.

```url
http://localhost:8181/ratings/student/:receiverId?showid=0
```

#### Example Request

cURL

```sh
curl "localhost:8181/ratings/student/S01234567A?showid=0"
```

#### Response

If request was successful, a JSON array of ratings will be returned. `raterId` field will be an empty string if anonymous is true.
If request was unsuccessful, a corresponding status code and error message will be returned.

_To return `raterId` regardless of anonymity, change `showid=0` in endpoint URL to `showid=1`._

**Example**

```JSON
[
    {
        "id": 1,
        "rating": 5,
        "raterId": "T01234567A",
        "raterType": "tutor",
        "receiverId": "S01234567A",
        "receiverType": "student",
        "datetime": "2022-1-31 09:52:49",
        "anonymous": false
    },
    {
        "id": 2,
        "rating": 4,
        "raterId": "",
        "raterType": "tutor",
        "receiverId": "S01234567A",
        "receiverType": "student",
        "datetime": "2022-1-31 09:52:49",
        "anonymous": true
    }
]
```

---

### 1.2 GET ratings (given)

This endpoint is used to get all ratings given by the tutor to other students.

#### Endpoint URL

`:receiverId` is referencing tutor's id.

```url
http://localhost:8181/ratings/tutor/:receiverId/given
```

#### Example Request

cURL

```sh
curl "localhost:8181/ratings/tutor/T01234567A/given"
```

#### Response

If request was successful, a JSON array of ratings will be returned.
If request was unsuccessful, a corresponding status code and error message will be returned.

**Example**

```JSON
[
    {
        "id": 1,
        "rating": 4,
        "raterId": "T01234567A",
        "raterType": "tutor",
        "receiverId": "S01234567A",
        "receiverType": "student",
        "datetime": "2022-1-31 09:52:49",
        "anonymous": false
    },
    {
        "id": 2,
        "rating": 3,
        "raterId": "T01234567A",
        "raterType": "tutor",
        "receiverId": "S12345678B",
        "receiverType": "student",
        "datetime": "2022-1-31 09:52:49",
        "anonymous": false
    }
]
```

---

### 1.3 POST ratings

This endpoint is used by tutors to give a new rating.

#### Endpoint URL

```url
http://localhost:8181/ratings
```

#### JSON Body Parameters

| Name         | Type    | Required | Description                                                                                                   |
| ------------ | ------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `rating`     | integer | Required | An integer between 1 to 5 inclusive representing the rating score                                             |
| `raterId`    | string  | Required | The ID of the tutor giving the rating                                                                         |
| `receiverId` | string  | Required | The ID of the student receiving the rating                                                                    |
| `anonymous`  | boolean | Optional | Specify whether the rating should be anonymous, where `true` means remain anonymous. Default value is `false` |

#### Example Request

cURL

```sh
curl --request POST 'localhost:8181/ratings' \
--header 'Content-Type: application/json' \
--data '{
    "rating": 4,
    "raterId": "T01234567A",
    "receiverId": "S01234567A",
    "anonymous": true
}'
```

Windows cURL

```sh
curl --request POST "localhost:8181/ratings" --header "Content-Type: application/json" --data "{\"rating\": 4,\"raterId\": \"T01234567A\",\"receiverId\": \"S01234567A\",\"anonymous\":true}"
```

#### Response

The response will be a status code `201` if request was successful, otherwise a corresponding status code and error message.

---

### 1.4 PUT ratings

This endpoint is used by tutors to update their own ratings.

#### Endpoint URL

```url
http://localhost:8181/ratings
```

#### JSON Body Parameters

| Name        | Type    | Required | Description                                                                                                   |
| ----------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `id`        | number  | Required | The ID of the rating given                                                                                    |
| `rating`    | number  | Required | An integer between 1 to 5 inclusive representing the rating score                                             |
| `anonymous` | boolean | Optional | Specify whether the rating should be anonymous, where `true` means remain anonymous. Default value is `false` |

#### Example Request

cURL

```sh
curl --request PUT 'localhost:8181/ratings' \
--header 'Content-Type: application/json' \
--data '{
    "id": 1,
    "rating": 4,
    "anonymous": false
}'
```

Windows cURL

```sh
curl --request PUT "localhost:8181/ratings" --header "Content-Type: application/json" --data "{\"id\": 1,\"rating\": 4,\"anonymous\":false}"
```

#### Response

The response will be a status code `202` if request was successful, otherwise a corresponding status code and error message.

---

## 2. Comments

Base URL: `localhost:8182/comments`

---

### 2.1 GET comments

This endpoint is used to get all comments given by tutors to other students.

#### Endpoint URL

`:receiverId` is referencing student's id.

```url
http://localhost:8182/comments/student/:receiverId?showid=0
```

#### Example Request

cURL

```sh
curl "localhost:8182/comments/student/S01234567A?showid=0"
```

#### Response

If request was successful, a JSON array of comments will be returned. `commentorId` field will be an empty string if anonymous is true.
If request was unsuccessful, a corresponding status code and error message will be returned.

_To return `commentorId` regardless of anonymity, change `showid=0` in endpoint URL to `showid=1`._

**Example**

```JSON
[
    {
        "id": 1,
        "comment": "Hands up work on time.",
        "commentorId": "T01234567A",
        "commentorType": "tutor",
        "receiverId": "S01234567A",
        "receiverType": "student",
        "datetime": "2022-1-31 09:52:49",
        "anonymous": false
    },
    {
        "id": 2,
        "comment": "Excellent work!",
        "commentorId": "",
        "commentorType": "tutor",
        "receiverId": "S12345678B",
        "receiverType": "student",
        "datetime": "2022-1-31 09:52:49",
        "anonymous": false
    }
]
```

---

### 2.2 GET comments (given)

This endpoint is used to get all comments given by the tutor to other students.

#### Endpoint URL

`:receiverId` is referencing tutor's id.

```url
http://localhost:8182/comments/tutor/:receiverId/given
```

#### Example Request

cURL

```sh
curl "localhost:8182/comments/tutor/T01234567A/given"
```

#### Response

If request was successful, a JSON array of comments will be returned.
If request was unsuccessful, a corresponding status code and error message will be returned.

**Example**

```JSON
[
    {
        "id": 1,
        "comment": "Excellent work!",
        "commentorId": "T01234567A",
        "commentorType": "tutor",
        "receiverId": "S01234567A",
        "receiverType": "student",
        "datetime": "2022-1-31 09:52:49",
        "anonymous": false
    },
    {
        "id": 2,
        "comment": "Hands up work on time.",
        "commentorId": "T01234567A",
        "commentorType": "tutor",
        "receiverId": "S12345678B",
        "receiverType": "student",
        "datetime": "2022-1-31 09:52:49",
        "anonymous": true
    }
]
```

---

### 2.3 POST comments

This endpoint is used by tutors to give a new comment.

#### Endpoint URL

```url
http://localhost:8182/comments
```

#### JSON Body Parameters

| Name          | Type    | Required | Description                                                                                                               |
| ------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `comment`     | string  | Required | A message that contains at least 1 character, and consists of only `0-9`, `a-z`, `A-Z` and `,.!?+-*/%=()$@:'\` characters |
| `commentorId` | string  | Required | The ID of the tutor giving the comment                                                                                    |
| `receiverId`  | string  | Required | The ID of the student receiving the comment                                                                               |
| `anonymous`   | boolean | Optional | Specify whether the comment should be anonymous, where `true` means remain anonymous. Default value is `false`            |

#### Example Request

cURL

```sh
curl --request POST 'localhost:8182/comments' \
--header 'Content-Type: application/json' \
--data '{
    "comment": "Excellent work!",
    "commentorId": "T01234567A",
    "receiverId": "S01234567A",
    "anonymous": true
}'
```

Windows cURL

```sh
curl --request POST "localhost:8182/comments" --header "Content-Type: application/json" --data "{\"comment\": \"Excellent work!\",\"commentorId\": \"T01234567A\",\"receiverId\": \"S01234567A\",\"anonymous\": true}"
```

#### Response

The response will be a status code `201` if request was successful, otherwise a corresponding status code and error message.

---

### 2.4 PUT comments

This endpoint is used by tutors to update their own comments.

#### Endpoint URL

```url
http://localhost:8182/comments
```

#### JSON Body Parameters

| Name        | Type    | Required | Description                                                                                                                                                  |
| ----------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`        | number  | Required | The ID of the comment given                                                                                                                                  |
| `comment`   | number  | Required | A message that contains at least 1 character, and consists of only `0-9`, `a-z`, `A-Z` and `,.!?+-*/%=()$@:'\` characters                                    |
| `studentId` | string  | Required | The ID of the student giving the comment                                                                                                                     |
| `anonymous` | boolean | Optional | Specify whether the comment should be anonymous, where `true` means remain anonymous. Leaving this parameter empty will leave the anonymity status unchanged |

#### Example Request

cURL

```sh
curl --request PUT 'localhost:8182/comments' \
--header 'Content-Type: application/json' \
--data '{
    "id": 1,
    "comment": "Decent work.",
    "anonymous": true
}'
```

Windows cURL

```sh
curl --request PUT "localhost:8182/comments" --header "Content-Type: application/json" --data "{\"id\": 1,\"comment\": \"Decent work.\",\"anonymous\": true}"
```

#### Response

The response will be a status code `202` if request was successful, otherwise a corresponding status code and error message.

---
