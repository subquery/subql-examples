# SubQuery Example - Summary of Rewards and Slashes

This subquery indexes staking bonds, rewards and slashes of each finalized blocks.

This is an example of EventHandler, provides records of all the accounts that have participated in staking, and summarize their total rewards and slashes. In the end, calculate the total earnings.

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
