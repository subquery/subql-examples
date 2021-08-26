# What is SubQuery?

SubQuery powers the next generation of Polkadot dApps by allowing developers to extract, transform and query blockchain data in real time using GraphQL. In addition to this, SubQuery provides production quality hosting infrastructure to run these projects in.

# SubQuery Example - Validator Threshold

This subquery indexes the least staking amount required for a validator to be elected.

This is an example of using `@polkadot/api` in the mapping function. Proofs:
1. historical metadatas are correctly handled, registry, consts are swapped. (see maxNominatorRewardedPerValidator)
2. Queries are restricted to the current processed block. (see validators and exposures)
3. api.queryMulti is supported. (see activeEra, currentEra)

# Getting Started

### 1. Clone the entire subql-example repository

```shell
git clone https://github.com/subquery/subql-examples.git

```
### 2. Install dependencies

```shell
cd validator-threshold
# Yarn
yarn

#NPM
npm install
```

### 3. Generate types

```shell
#Yarn
yarn codegen

#NPM
npm run-script codegen
```

### 4. Build the project

```shell
#Yarn
yarn build

#NPM
npm run-script build
```

### 5. Run locally

```shell
#Yarn
yarn start:docker

#NPM
npm run start:docker
```

### 5. Example query to run

```shell
{
  query{
    validatorThresholds{
      nodes{
        leastStaked,
        totalStaked
      }
    }
  }
}
```