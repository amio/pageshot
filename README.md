# pageshot

A micro-service for generating image from webpage.

Now only works on Mac, as Linux lack some runtime dependencies required by electron.

## Usage

ENDPOINT: https://localhost:3003/

Example:
  - https://localhost:3003/?url=https://google.com
  - https://localhost:3003/?url=https://google.com&height=960

## Query Params

- __url__: The webpage location. (required)
- __width__: Viewport width. (default: 960)
- __height__: Viewport height. (default: 640)

## License

ISC © [Amio](https://github.com/amio)
