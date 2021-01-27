# SubQuery Example - Timestamp of Blocks

This subquery indexes timestamp of each finalized blocks.

It is an example of CallHandler, by processing `timestamp.set` extrinsic, and extracting the first args of it, we can retrieve the timestamp we want. 

# Get Started
### 1. install dependencies
```shell
yarn
```

### 2. generate types
```shell
yarn codegen
```

### 3. build
```shell
yarn build
```

### 4. run locally
```shell
yarn start:docker
```

### 5. query
open https://www.graphqlbin.com/v2/new
and use `http://localhost:3000` as endpoint