# stine_pernille_development_platforms_ca

Characters

Create a new character
POST /characters/character
Body

```
{
  "name": "string",
  "movie": ["string"],
  "main": boolen,
  "gender": "string",
  "species": "string"
}
```

Edit a character
PUT /characters/character/{id}
Body

```
{
  "name": "string",
  "movie": ["string"],
  "main": boolen,
  "gender": "string",
  "species": "string"
}
```

Get all the characters
GET /characters/characters

Get a single character
GET /characters/character/{id}

Delete a single character
DELETE /characters/character/{id}

Movies

Create a new movie
POST /movies/movie
Body

```
{
    "title": "string",
    "releaseYear": "2024-02-08T10:39:40.529Z",
    "characters": [],
    "studio": "string",
    "description": "string"
}
```

Get all the movies
GET /movies/movie

Delete a single movie
DELETE /movies/movie/{id}

Studios

Get all the studios
GET /studios/studio
