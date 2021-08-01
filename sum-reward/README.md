# What is SubQuery?

SubQuery powers the next generation of Polkadot dApps by allowing developers to extract, transform and query blockchain data in real time using GraphQL. In addition to this, SubQuery provides production quality hosting infrastructure to run these projects in.

# SubQuery Example - Summary of Rewards and Slashes

This subquery indexes staking bonds, rewards and slashes of each finalized blocks.

This is an example of EventHandler that provides records of all the accounts that have participated in staking and summarizes their total rewards and slashes. It also provides the total earnings.

# Getting Started

### 1. Clone the entire subql-example repository

```shell
git clone https://github.com/subquery/subql-examples.git

```
### 2. Install dependencies

```shell
cd sum-reward
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

### 5. Example queries to run

```shell
{
  query{
    stakingRewards{
      nodes{
        balance
      }
    }
  }
}
```

```shell
{
  query{
    stakingSlashes{
      nodes{
        balance
      }
    }
  }
}
```

```shell
{
  query{
    sumRewards{
      nodes{
        rewards{
          nodes{
            balance
          }
        }
      }
    }
  }
}
```