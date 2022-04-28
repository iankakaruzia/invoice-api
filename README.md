# Invoice API

API used on for the invoice app challenge from [Frontend Mentor](https://www.frontendmentor.io/challenges/invoice-app-i7KaLTQjl)

[![CircleCI](https://circleci.com/gh/iankakaruzia/invoice-api/tree/main.svg?style=svg)](https://circleci.com/gh/iankakaruzia/invoice-api/tree/main)
![GitHub](https://img.shields.io/github/license/iankakaruzia/invoice-api)
## Tech Stack

Node, Express, Prisma, PostgreSQL


## Run Locally

Clone the project

```bash
  git clone https://github.com/iankakaruzia/invoice-api
```

Go to the project directory

```bash
  cd invoice-app
```

Install dependencies

```bash
  npm install
```

Make sure you have the Docker container running

```bash
  docker-compose up -d
```

Start the server

```bash
  npm run start:dev
```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```


## Environment Variables

To run this project, you will need to add some enviroment Variables to the `.env` file. Those variables can be found in the `.env.example` file.


## Features

- Authentication
    - Login
    - Register
    - Forgot Password
    - Reset Password
- Invoices
    - Create Draft/Pending Invoice
    - Update Invoice
    - Set Invoice as Paid
    - Remove Invoice
    - List Invoices with Pagination and Filter
    - Get a single Invoice


## Roadmap

- Add more unit tests
- Add more e2e tests
- Add tests jobs on the pipeline


## API Reference

The API swagger can be found on the `/api` endpoint


## Authors

- [@iankakaruzia](https://www.github.com/iankakaruzia)


## License

[MIT](https://github.com/iankakaruzia/invoice-api/blob/main/LICENSE)
