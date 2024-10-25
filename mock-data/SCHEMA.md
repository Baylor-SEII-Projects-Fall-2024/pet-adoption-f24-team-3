# Schema for Various Entities

The JSON Schema for each individual entity can be described as follows

## Adoption Center

```json
{
    accountType: "Center",
    emailAddress: formData.email,
    password: formData.password,
    name: formData.centerName,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    zipCode: formData.zip,
    description: "A safe haven for homeless pets",
}
```

## Potential Owner

```json
{
    accountType: "Owner",
    emailAddress: formData.email,
    password: formData.password,
    nameFirst: formData.firstName,
    nameLast: formData.lastName
}
```

## Preference

```json
{
    date: new Date().toJSON(),
    name: formData.name,
    species: formData.species,
    breed: formData.breed,
    sex: formData.sex,
    age: formData.age,
    ageClass: formData.ageClass,
    size: formData.size,
    height: formData.height,
    weight: formData.weight,
    description: formData.description,
    centerId: currentUserId,
}
```

## Pet

```json
{
    date: new Date().toJSON(),
    name: formData.name,
    species: formData.species,
    breed: formData.breed,
    sex: formData.sex,
    age: formData.age,
    ageClass: formData.ageClass,
    size: formData.size,
    height: formData.height,
    weight: formData.weight,
    description: formData.description,
    centerId: currentUserId,
}
```

## Event

```json
{
    centerId: centerId,
    datePosted: formData.datePosted,
    name: formData.name,
    description: formData.description,
    dateStart: formData.dateStart,
    dateEnd: formData.dateEnd
}
```

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
