![open grant logo](https://raw.githubusercontent.com/w3f/General-Grants-Program/master/src/badge_black.svg)
# subquery-examples
[Subquery](https://github.com/subquery/subql) is a Web3 Foundation Open Grant Project.
This repo includes examples that we made to demonstrate how to use subquery.

| Example                   | Description                                          | Keywords     |
|---------------------------|------------------------------------------------------|--------------|
| [extrinsic-finalized-block](extrinsic-finalized-block) | Index extrinsics and so they can be queried by hash. | blockHandler |
| [block-timestamp](block-timestamp) | Indexes timestamp of each finalized block. | callHandler |
| [sum-reward](sum-reward) | Indexes staking bond, reward and slash from events of finalized block. | eventHandler |
| [kitty](kitty) | Indexes birthinfo of kitties. | callHandler, eventHandler, customTypes |
| [validator-threshold](validator-threshold) | Indexes the least staking amount required for a validator to be elected. | blockHandler, @polkadot/api |
| [entity-relation](entity-relation) | Indexes balance transfers between accounts, also indexes utility batchAll to find out the content of the extrinsic calls | One-to-many, many-to-many relationship |
