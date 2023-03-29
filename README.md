### Starting the client locally

```bash
pnpm run dev
```

The client will be available at http://127.0.0.1:5173/


### Starting the server locally

```bash
cargo run
```

After starting the server, you can publish a message by sending a POST request:

```bash
curl -X POST 'http://localhost:9160/publish' \
-H 'Content-Type: application/json' \
-d '{"user_id": 1, "message": "holi boli"}'
```
