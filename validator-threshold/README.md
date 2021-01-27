# SubQuery Example - Validator Threshold

This subquery indexes the least staking amount required for a validator to be elected.

This is an example of using `@polkadot/api` in the mapping function. Proofs 
1. historical metadatas are correctly handled, registry, consts are swapped. (see maxNominatorRewardedPerValidator)
2. Queries are restricted to the current processed block. (see validators and exposures)
3. api.queryMulti is supported. (see activeEra, currentEra)

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
