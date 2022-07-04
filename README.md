The devDependencies for this project are

```
"devDependencies": {
    "jest": "^27.5.1",
    "jest-extended": "^2.0.0",
    "pg-format": "^1.0.4",
    "husky": "^7.0.0"
  },
```

and the dependencies are

```
 "dependencies": {
  "dotenv": "^16.0.0",
  "pg": "^8.7.3"
},
```

In order to run this project locally, create two .env files in the root directory

- .env.development file with PGDATABASE=nc_news
- .env.test file with PGDATABASE=nc_news_test
