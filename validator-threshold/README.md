# SubQuery Example - Validator Threshold

This subquery indexes the least staking amount required for a validator to be elected.

This is an example of using `@polkadot/api` in the mapping function. Proofs 
1. historical metadatas are correctly handled, registry, consts are swapped. (see maxNominatorRewardedPerValidator)
2. Queries are restricted to the current processed block. (see validators and exposures)
3. api.queryMulti is supported. (see activeEra, currentEra)

