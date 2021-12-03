import {ActiveEraInfo, Balance, EraIndex, Exposure } from "@polkadot/types/interfaces";
import {PalletStakingExposure} from "@polkadot/types/lookup";
import {Option} from "@polkadot/types"
import {SubstrateEvent} from "@subql/types";
import {ValidatorThreshold} from "../types/models/ValidatorThreshold";

export async function handleBlock({ block }: SubstrateEvent): Promise<void> {
    // in the early stage of kusama, staking.activeEra didn't exist
    if (!api.query.staking.activeEra) return;
    const [activeEra] = await api.queryMulti<[Option<ActiveEraInfo>, Option<EraIndex>]>([
        api.query.staking.activeEra,
        // api.query.staking.currentEra
    ]);
    if (activeEra.isEmpty) return;
    const entity = new ValidatorThreshold(activeEra.unwrap().index.toString());
    const validators = await api.query.session.validators();
    const exposureInfos = await api.queryMulti<PalletStakingExposure[]>(
        validators.map(validator=>[api.query.staking.erasStakersClipped, [activeEra.unwrap().index, validator]])
    );
    const thresholdValidator = exposureInfos.reduce<{accountId: string, total: Balance}>((acc, exposure, idx)=>{
        if (!acc || exposure.total.unwrap().lt(acc.total)) {
            return {accountId: validators[idx].toString(), total: exposure.total.unwrap()};
        }
        return acc;
    }, undefined );
    entity.startBlock = block.block.header.number.toNumber();
    entity.timestamp = block.timestamp;
    entity.totalValidators = validators.length;
    entity.validatorWithLeastBond = thresholdValidator.accountId;
    entity.leastStaked = thresholdValidator.total.toBigInt();
    entity.totalStaked = (await api.query.staking.erasTotalStake(activeEra.unwrap().index)).toBigInt();
    entity.maxNominatorRewardedPerValidator = api.consts.staking.maxNominatorRewardedPerValidator?.toNumber();
    await entity.save();
}
