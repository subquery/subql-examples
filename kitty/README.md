# SubQuery Example - Kitty

This subquery indexes birthinfo of kitties.

It demonstrates how to use Subquery to extract data from your dedicated chain.

The chain that works with this example is assignment #5 of [substrate-runtime-developer-academy](https://www.industryconnect.org/substrate-runtime-developer-academy/).
We will ask for their permission so we can post the link of that project (or copy the code).

# Get Started
### 1. install dependencies
```shell
yarn
```

### 2. generate types
```shell
yarn codegen
```

### 3. Generate interfaces for custom substrate chain

SubQuery can be used on any Substrate-based chain, not just Polkadot or Kusama. 

You can use a custom Substrate-based chain, and we provide tools to importing types, interfaces, and additional methods automatically using [@polkadot/typegen](https://polkadot.js.org/docs/api/examples/promise/typegen/).

The following instruction explain the integration process.

#### Preparation

Create a new directory `api-interfaces` under the project `src` folder to store all required and generated files. We also create an `api-interfaces/kitties` directory as we want to add decoration in API from the `kitties` module.

##### Metadata

We need metadata to generate the actual API endpoints. In the kitty example, we use an endpoint from a local testnet, and it provides additional types.
Follow the steps in [PolkadotJS metadata setup](https://polkadot.js.org/docs/api/examples/promise/typegen#metadata-setup) to retrieve a node's metadata from its **HTTP** endpoint.

```shell
curl -H "Content-Type: application/json" -d '{"id":"1", "jsonrpc":"2.0", "method": "state_getMetadata", "params":[]}' http://localhost:9933
```
or from its **websocket** endpoint with help from [`websocat`](https://github.com/vi/websocat):

```shell
//Install the websocat
brew install websocat

//Get metadata
echo state_getMetadata | websocat 'ws://127.0.0.1:9944' --jsonrpc
```

Then copy and paste the output to a JSON file. In our [kitty example](https://github.com/subquery/subql-examples/tree/main/kitty), we have created `api-interface/kitty.json`.

##### Type definitions
In our assumption, the user should know the specific types and RPC from the chain, and it is defined in the [Manifest](/create/manifest.html). 
Following [types setup](https://polkadot.js.org/docs/api/examples/promise/typegen#metadata-setup), we create :

- `src/api-interfaces/definitions.ts` - this exports all the sub-folder definitions 

```ts
export { default as kitties } from './kitties/definitions';
```

- `src/api-interfaces/kitties/definitions.ts` - type definitions for the kitties module
```ts
export default {
    // custom types
    types: {
        Address: "AccountId",
        LookupSource: "AccountId",
        KittyIndex: "u32",
        Kitty: "[u8; 16]"
    },
    // custom rpc : api.rpc.kitties.getKittyPrice
    rpc: {
        getKittyPrice:{
            description: 'Get Kitty price',
            params: [
                {
                    name: 'at',
                    type: 'BlockHash',
                    isHistoric: true,
                    isOptional: false
                },
                {
                    name: 'kittyIndex',
                    type: 'KittyIndex',
                    isOptional: false
                }
            ],
            type: 'Balance'
        }
    }
}
```

##### Packages


- In the `package.json` development, make sure to add `@polkadot/typegen` as a development dependency and `@polkadot/api` as a regular dependency (ideally the same version). We also need the `ts-node` in development dependency to help us run the scripts.
- We add scripts to run both types `generate:defs` and metadata `generate:meta` generators (in that order, so metadata can use the types).

Here is a simplified version of `package.json`. Make sure in the **scripts** section the package name is correct and directories are valid.

```json
{
  "name": "kitty-birthinfo",
  "scripts": {
    "generate:defs": "ts-node --skip-project node_modules/.bin/polkadot-types-from-defs --package kitty-birthinfo/api-interfaces --input ./src/api-interfaces",
    "generate:meta": "ts-node --skip-project node_modules/.bin/polkadot-types-from-chain --package kitty-birthinfo/api-interfaces --endpoint ./src/api-interfaces/kitty.json --output ./src/api-interfaces --strict"
  },
  "dependencies": {
    "@polkadot/api": "^4.9.2"
  },
  "devDependencies": {
    "typescript": "^4.1.3",
    "@polkadot/typegen": "^4.9.2",
    "ts-node": "^8.6.2"
  }
}
```

#### Type generation

Now the preparation is completed, we are ready to generate types and metadata. Run the commands below:

```shell
# Yarn to install new dependencies
yarn

# Generate types
yarn generate:defs
```

In each modules folder (eg `/kitties`), there should now be a generated `types.ts` that defines all interfaces from this modules' definitions, also a file `index.ts` that exports them all.

Then run:

```shell

# Generate meta
yarn generate:meta

```

This command will generate the metadata and new api-augment for the APIs. As we don't want to use the built-in API, we need to replace them by adding an explicit override in our `tsconfig.json`.
After updates, the paths in the config look like so (without the comments)

```json
{
  "compilerOptions": {
      // this is the package name we use (in the interface imports, --package for generators) */
      "kitty-birthinfo/*": ["src/*"],
      // here we replace the @polkadot/api augmentation with our own, generated from chain
      "@polkadot/api/augment": ["src/interfaces/augment-api.ts"],
      // replace the augmented types with our own, as generated from definitions
      "@polkadot/types/augment": ["src/interfaces/augment-types.ts"]
    }
}
```


#### Usage

Now in the mapping function, we can show how the metadata and types actually decorate the API.



```typescript
export async function kittyApiHandler(): Promise<void> {
    //return the KittyIndex type
    const nextKittyId = await api.query.kitties.nextKittyId();
    // return the Kitty type, input parameters types are AccountId and KittyIndex
    const allKitties  = await api.query.kitties.kitties('xxxxxxxxx',123)
    // return kitty price as Balance type, take one blockHash and KittyIndex for inputs.
    // This feature is not support yet, wait to complete https://github.com/subquery/subql/issues/302 
    const kittyPrice = await api.rpc.kitties.getKittyPrice(undefined,nextKittyId);
    logger.info(`Next kitty id ${nextKittyId}`)
}
```


### 4. build
```shell
yarn build
```

### 5. run locally
```shell
yarn start:docker
```

### 6. Publish a project

**If you wish to publish this project to our explorer, please include the generated files in `src/api-interfaces`.**
