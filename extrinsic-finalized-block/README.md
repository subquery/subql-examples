# What is SubQuery?

SubQuery powers the next generation of Polkadot dApps by allowing developers to extract, transform and query blockchain data in realtime using GraphQL. In addition to this, SubQuery provides production quality hosting infrastructure to run these projects.

# SubQuery Example - Extrinsics within Finalized Blocks

This subquery indexes extrinsics and so they can be queried by a hash.

It is an example of a BlockHandler and by using the SignedBlock class, we can access various properties such as the block hash. It also uses the Extrinsic class to extract the properties such as the extrinsic block height and the extrinsic origin signer.

### 1. Clone the entire subql-example repository

```shell
git clone https://github.com/subquery/subql-examples.git

```

### 2. Install dependencies

```shell
cd extrinsic-finalized-block
# Yarn
yarn

#NPM
npm install
```

### 2. generate types
```shell
#Yarn
yarn codegen

#NPM
npm run-script codegen
```

### 3. build
```shell
#Yarn
yarn build

#NPM
npm run-script build
```

### 4. run locally
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
    extrinsics(last:5, orderBy:BLOCK_HEIGHT_ASC){
      nodes{
        blockHash,
        blockHeight,
        origin
      }
    }
  }
}
```

# Understanding this project

This project is an example of an extrinsic which is a piece of information that comes from outside the chain and is included in a block. If you are already familiar with blockchain concepts, you can think of extrinsics as comparable to transactions.

Starting in the mappings directory with the Extrinsic.ts file, there is an asynchronous function called handleBlock. This is of type [BlockHandler](https://doc.subquery.network/create/mapping.html#block-handler) and is defined in the [manifest](https://doc.subquery.network/create/manifest.html) file (aka project.yaml) as "kind: substrate/BlockHandler"

The [schema.graphql](https://doc.subquery.network/create/graphql.html) file defines the variables blockHeight and blockHash which are both mandatory and of type BigInt and String respectively. Origin is also defined here as a string but is not mandatory.

If we examine the code in Extrinsic.ts in more detail, you can see that the function handleBlock takes one argument of type SignedBlock. thisBlock then has access to the block.header.hash property, is then converted to a string and assigned to a variable called blockHash. 

Next, the await keyword is used to pause the code on this line until the promise fulfills. This is because blockHash needs to be non-null as it is later assigned to entity.blockHash.

Entity however is a new instance of Extrinsic and the 3 properties, blockHash, blockHeight, and origin are assigned various values. 