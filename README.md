# Instructions

## Run

Run with docker compose:

```bash
$ docker-compose up -d
```

## API call examples

```bash
$ curl "localhost:8080/convert?amount=100&src_currency=GBP&dest_currency=USD&reference_date=2020-03-25"
$ curl "localhost:8080/convert?amount=200&src_currency=AUD&dest_currency=CAD"
```

## Run the tests

Install dependencies then run with npm:

```bash
$ npm i
$ npm test
````

or yarn:

```bash
$ yarn
$ yarn test
```
