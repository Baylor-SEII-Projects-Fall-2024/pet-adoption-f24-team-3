# Schema for Various Entities

The JSON Schema for each individual entity can be described as follows

## Endpoints

| Endpoint | Description |
| `api/animals/` | Create new pet |
| `api/animals/center/{centerId}` | Get pet posts for a certain center |
| `api/animals/{animalid}` | Get a specific animal |
| `api/centers` | Register adoption center |
| `api/owners` | Register potential owner |
| `api/users` | Get all registered users |
| `api/events/` | Create event |
| `api/update/preferences` | Update users preferences |

---

## Adoption Center

### Request

```json
{
    "accountType": "Center",
    "emailAddress": formData.email,
    "password": formData.password,
    "name": formData.centerName,
    "address": formData.address,
    "city": formData.city,
    "state": formData.state,
    "zipCode": formData.zip,
    "description": "A safe haven for homeless pets",
}
```

### Response

```json
{
    "userid": <num>
}
```

---

## Potential Owner

### Request

```json
{
    "accountType": "Owner",
    "emailAddress": formData.email,
    "password": formData.password,
    "nameFirst": formData.firstName,
    "nameLast": formData.lastName
}
```

### Response

```json
{
    "userid": <num>
}
```

---

## Preference

### Request

```json
{
    "userId": "id",
    "species": formData.species,
    "breed": formData.breed,
    "sex": formData.sex,
    "ageClass": formData.age,
    "size": formData.size,
    "city": formData.city,
    "state": formData.state
}
```

### Response

```json
{
    "preference": {
        "id": <num>,
        "potentialOwnerId": <num>,
        "species": "",
        "breed": "",
        "sex": "",
        "ageClass": "",
        "size": "",
        "city": "",
        "state": ""
    }
}
```

---

## Pet

### Request

```json
{
    "date": "2024-10-28T12:55:27.748Z",
    "name": formData.name,
    "species": formData.species,
    "breed": formData.breed,
    "sex": formData.sex,
    "age": formData.age,
    "ageClass": formData.ageClass,
    "size": formData.size,
    "height": formData.height,
    "weight": formData.weight,
    "description": formData.description,
    "centerId": currentUserId,
}
```

### Response

```json
{
    "id": <petid>,
    "centerId": <centerid>,
    "datePosted": "",
    "name": "",
    "age": "",
    "species": "",
    "breed": "",
    "sex": "",
    "picPath": "",
    "description": "",
    "size": "",
    "ageClass": "",
    "height": <num>,
    "weight": <num>,

}
```

---

## Event

### Request

```json
{
    "centerId": <centerId>,
    "datePosted": formData.datePosted,
    "name": formData.name,
    "description": formData.description,
    "dateStart": formData.dateStart,
    "dateEnd": formData.dateEnd
}
```

### Response

```json
{
    "eventID": <id>
}
```

---

## Pictures

Pictures use `formData` as opposed to a json response body. I will have
to do some research to find the best way to generate a thousand random
pictures.

Potential `formData` schema:

```
------WebKitFormBoundaryABC123
Content-Disposition: form-data; name="imageFile"; filename="profile.jpg"
Content-Type: image/jpeg

[Binary data of the image file]
------WebKitFormBoundaryABC123--
```
