# pageshot

Pageshot as a service.

## Usage

- __Web__: https://shot.now.sh
- __Endpoint__: https://shot.now.sh/

Examples:

- https://shot.now.sh/shot?url=https://google.com
- https://shot.now.sh/shot?url=https://google.com&height=1440

Query Params:

- __url__: The webpage location. (required)
- __width__: Viewport width. (default: 960)
- __height__: Viewport height. (default: 640)

## Deploy

- to [now.sh](https://zeit.co/now):

```
now amio/pageshot
```

- to your own server, either:
  - use [Dockerfile](Dockerfile).
  - clone the code then `npm start` (require google-chrome installed)

## License

ISC © [Amio](https://github.com/amio)
