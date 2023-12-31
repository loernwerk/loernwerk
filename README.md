# loernwerk

A web app for creating learning sequences.

## Setup
Setting up the platform is as easy as it gets:
1. (Install NodeJS, version 18 or later)
2. Obtain a built version of the platform
    1. Either download a prebuilt release
    2. Alternatively, [build from source](#building-the-platform-from-source)
3. Install the required dependencies by running `npm i`
4. Start the platform by running `npm run start`
5. Enjoy! The platform will download some required files, and create a default admin at first launch, whose credentials will be displayed in the terminal. The platform will serve at `http://localhost:5000` by default.

Alternatively, a Dockerfile is also available to build the platform to a docker image.

## Configuration

Some basic settings of the platform can be configured via environment variables. These are:

| Variable        | Description                                                                             | Default        |
|-----------------|-----------------------------------------------------------------------------------------|----------------|
| `PORT`          | Port of the application.                                                                | `5000`         |
| `HOSTNAME`      | Hostname of the application.                                                            | `localhost`    |
| `DATABASE_FILE` | Database file for the SQLite database.                                                  | `loernwerk.db` |
| `SSL_KEYFILE`   | File containing the key used for SSL encryption. Required for the HTTPS server.         |                |
| `SSL_CERTFILE`  | File containing the certificate used for SSL encryption. Required for the HTTPS server. |                |
| `SSL_PORT`      | Port for the HTTPS server.                                                              | `5443`         |
| `SSL_CAFILE`    | CA File used for SSL encryption. Optional.                                              |                |
| `DISABLE_HTTP`  | If set, will disable the HTTP server.                                                   |                |
| `PUBLIC_URL`    | URL under which the platform will be accessible. Optional. See below for more info.     |                |

`.env` files can also be used to set these variables.

### `PUBLIC_URL`
The H5P implementation needs to know the address of your webserver in order to correctly send requests to it.
By default, it tries to guess, based on the `HOSTNAME`, `PORT` and SSL-variables.
In situations where the server can't correctly guess your address, for example if you're running loernwerk behind a reverse proxy, the H5P implementation will fail to make requests.
In fix that, set the `PUBLIC_URL` variable to the publicly available address under which you're planning to serve loernwerk, e.g. `https://loernwerk.de`.

## Adding a custom imprint
The imprint file is located inside the `dist/imprint.html`. The content of this file can be changed to your liking to add your custom imprint.

Alternatively, the imprint can be changed in the source files at `frontend/public/imprint.html`, after which the platform needs to be recompiled.

## Security warning - automatic file download
The platform automatically downloads & serves the required H5P libraries.
The libraries are downloaded upon server start, if they aren't found on the filesystem.
This poses a possible security risk, if the H5P libraries contain malicious code, or the automatic download is redirected to malicious files.
To avoid the automatic download and unpacking of the libraries, you can manually download the [H5P library](https://github.com/h5p/h5p-php-library/archive/1.24.0.zip) and [H5P editor library](https://github.com/h5p/h5p-editor-php-library/archive/1.24.1.zip) and place them in the `/h5p/core` and `/h5p/editor` directories respectively.

## Building the platform from source
1. Clone the git repository
2. Install all dependencies by running `npm i`
3. Build the platform by running `npm run build`
   1. You may also only build parts of the platform by running `npm run build:frontend` or `npm run build:backend`
   2. The command `npm run build:postscript` runs the `build_postscript.ts` file which handles copying necessary assets and modifying the `package.json` inside the build output.
4. The built platform will be placed inside the `build` folder. You can also immediately run it by using `npm run start`!
