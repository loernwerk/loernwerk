# loernwerk

Documentation incoming. Soon :tm:

## Warning
This platform automatically downloads & serves the required H5P libraries.
This poses a possible security risk, if the H5P libraries are compromised.
To avoid the auto download, download the required [H5P library](https://github.com/h5p/h5p-php-library/archive/1.24.0.zip) and [H5P editor library](https://github.com/h5p/h5p-editor-php-library/archive/1.24.1.zip) and place them in the `/h5p/core` and `/h5p/editor` directories.

## Environment variables
- `PORT`: Port of the application. Default: 5000
- `HOSTNAME`: Hostname of the application. Default: 'localhost'
- `DATABASE_FILE`: Database file of the SQLite database. Default: 'dev.db'
- `SSL_KEYFILE`: File containing the key used for SSL encryption. If undefined, HTTPS server wont be started.
- `SSL_CERTFILE`: File containing the certificate used for SSL encryption. If undefined, HTTPS server wont be started.
- `SSL_PORT`: Port under which the HTTPS server should be started. Default: 5443.
- `SSL_CAFILE`: CA File to be used for SSL encryption. Optional.
- `DISABLE_HTTP`: If set, the HTTP server wont be started and therefore disabled.

## Imprint
To add your own imprint, edit the `build/dist/imprint.html` file.
Alternatively, the source file at `frontend/public/imprint.html` can be edited, however, the platform needs to be recompiled afterwards.

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
