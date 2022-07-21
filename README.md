# Glient test project

**_APi Documentations `/docs`_**

```sh
# setup .env file from .env.example
# and run this command
npx prisma migrate dev

# seed your database from `prisma/seed.sql` e.g.
psql -h localhost -U postgres -d glientdb -f ./prisma/seed.sql

# build and run the project
npm run dev

```

## Tools

- `Node.js@18.6.0`
- `Fastify`
- `Prisma`
- `PostgreSQL`
- `TypeScript`

## Available Scripts

In the project directory, you can run:

### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start`

For production mode
