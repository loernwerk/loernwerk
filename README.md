# loernwerk

Documentation incoming. Soon :tm:

## Environment variables
- `PORT`: Port of the application. Default: 5000
- `HOSTNAME`: Hostname of the application. Default: 'localhost'
- `DATABASE_FILE`: Database file of the SQLite database. Default: 'dev.db'

## Command reference

- `npm run dev`: Runs both backend and frontend dev server
- `npm run dev:backend`: Runs only backend dev server
- `npm run dev:frontend`: Runs only frontend dev server

- `npm run build`: Builds the entire project
- `npm run build:frontend`: Builds only the frontend using `vue-tsc` and `vite`
- `npm run build:backend`: Builds only the backend using `tsc`

- `npm run start`: Starts the built project
- `npm run lint`: Runs eslint on the entire sourcecode (also done precommit)
- `npm run prettier`: Runs prettier on the entire sourcecode (also done precommit)
