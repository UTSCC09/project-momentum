## Deployment
```
cd backend
docker build -t backend -f Dockerfile .
docker run -d --rm -p 8081:3000 backend
```

Backend is now accessible at http://34.130.127.231:8081/.

**NOTE:** Need to add firewall rules to allow access to port 8081.

**TODO:** Fix import error for `langchain` service.