import Redis from "ioredis"

export const redis = new Redis(Number(process.env.REDIS_PORT) as number, process.env.REDIS_HOST as string)

// get ip of redis server in docker container
// sudo docker inspect -f '{{range .NetworkSettings.Networks
// }}{{.IPAddress}}{{end}}' mredis
