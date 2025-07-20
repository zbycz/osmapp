Use type `ClimbingTick` in FE.

# POST /api/climbing-ticks

```
curl -X POST http://127.0.0.1:3000/api/climbing-ticks \
  -H "Content-Type: application/json" \
  -H "Cookie: osmAccessToken=XYZ" \
  -d '{
    "osmType": "node",
    "osmId": 123,
    "timestamp": "2024-06-10T12:00:00Z",
    "style": "OS",
    "note": "climbing with JV",
    "myGrade": "7-",
    "pairing": "{}"
  }'
```

# GET /api/climbing-ticks

```
curl http://127.0.0.1:3000/api/climbing-ticks \
  -H "Content-Type: application/json" \
  -H "Cookie: osmAccessToken=XYZ"
```

```
[
  {
    "id": 1,
    "osmUserId": 162287,
    "osmType": "node",
    "osmId": 123,
    "timestamp": "2024-06-10 12:00:00+00",
    "style": "OS",
    "note": "climbing with JV",
    "myGrade": "7-",
    "pairing": {}
  }
]
```

# DELETE /api/climbing-ticks/[id]

```
curl -X DELETE http://127.0.0.1:3000/api/climbing-ticks/1 \
  -H "Content-Type: application/json" \
  -H "Cookie: osmAccessToken=XYZ"
```
