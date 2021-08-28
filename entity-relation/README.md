# What is SubQuery?

SubQuery powers the next generation of Polkadot dApps by allowing developers to extract, transform and query blockchain data in real time using GraphQL. In addition to this, SubQuery provides production quality hosting infrastructure to run these projects in.

# SubQuery Example - Entity relations

This subquery indexes balance transfers between accounts, it is designed to demonstrate the many-to-many relationship within these entities.
 
This subquery also indexes the utility batchAll calls which are formated in tree structure, and we established an one-to-many relationship within those entities,  allow us to understand the actual actions of this extrinsic and know its position in the tree.

# Getting Started

### 1. Clone the entire subql-example repository

```shell
git clone https://github.com/subquery/subql-examples.git

```
### 2. Install dependencies

```shell
cd entity-relation
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
### 6. Example queries to run
```shell
{
  query{
    transfers{
      nodes{
        amount
      }
    }
  }
}
```