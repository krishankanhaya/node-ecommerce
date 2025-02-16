import Redis from "ioredis"

export const redis = new Redis(6379, '172.17.0.3')

// get ip of redis server in docker container
// sudo docker inspect -f '{{range .NetworkSettings.Networks
// }}{{.IPAddress}}{{end}}' mredis
