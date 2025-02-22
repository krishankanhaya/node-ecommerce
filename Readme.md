# Ecommerce Feature Project

## Project Scope - Monolithic Architecture

0. Basic ecommerce backend.
1. Scalable backend.
2. Docker, Redis, MongoDB, AWS, Kafka and other things that i don't know yet?

## Project Setup

-- with docker

0. Clone project : ```git clone https://github.com/krishankanhaya/node-ecommerce.git```
1. Create .env file :``
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecom
ACCESS_TOKEN_SECRET=secret
REFRESH_TOKEN_SECRET=secret
REDIS_HOST=your_redis_server_host
REDIS_PORT=your_redis_server_port
RP_KEY_ID=rzp_test_key_id
RP_SECRET_KEY=your_secret_key
``
2. ``sudo docker build -t ecommerce .``
3. ``sudo docker compose up``

-- without docker

0. Dependancy Installation : Node version >= 23.x.x , Latest MongoDB is used 4.4 because my cpu doesn't support AVF and redis in docker.

1. Clone project : ```git clone https://github.com/krishankanhaya/node-ecommerce.git```

2. Create .env file :``
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecom
ACCESS_TOKEN_SECRET=secret
REFRESH_TOKEN_SECRET=secret
REDIS_HOST=your_redis_server_host
REDIS_PORT=your_redis_server_port
RP_KEY_ID=rzp_test_key_id
RP_SECRET_KEY=your_secret_key
``
3. Make sure redis and mongo server is running properly.
4. Run Project : ```npm run dev```
