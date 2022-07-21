FROM node:18.6.0-alpine
WORKDIR /app
COPY . .
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait
RUN npm install
RUN echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/glientdb?schema=public" > .env
RUN /wait && npx prisma migrate dev

EXPOSE 3000
CMD npm start