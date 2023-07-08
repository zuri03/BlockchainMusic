import { ObjectId } from 'mongodb';

export default interface User {
    id?: ObjectId,
    username: string,
    password: string
}

/*
song-service:
    image: song-service
    environment:
       - MONGO_USERNAME=${MONGO_MUSIC_SERVICE_USERNAME}
       - MONGO_PASSWORD=${MONGO_MUSIC_SERVICE_PASSWORD}
       - MONGO_DB_NAME=${MONGO_INITDB_DATABASE}
       - AWS_BUCKET_REGION=${AWS_BUCKET_REGION}
       - AWS_BUCKET_NAME=${AWS_BUCKET_NAME}
       - AWS_ACCESS_KEY=${AWS_ACCESS_KEY}
       - AWS_SECRET_KEY=${AWS_SECRET_KEY}
    build:
      context: ./music-service/.
      dockerfile: ./Dockerfile
    ports:
      - '8888:8888'
    depends_on:
      - music-mongo
    container_name: music-container
    restart: unless-stopped

  music-mongo:
    image: mongo:latest
    env_file:
      - .env
    ports: 
      - "27017:27017"
    volumes:
      - ./scripts/music-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro

*/