import {ActiveEraInfo, Balance, EraIndex, Exposure } from "@polkadot/types/interfaces";
import {Option} from "@polkadot/types"
import {SubstrateBlock} from "@subql/types";
import {ValidatorThreshold} from "../types/models/ValidatorThreshold";

export async function handleBlock(block: SubstrateBlock): Promise<void> {
    const [activeEra, currentEra] = await api.queryMulti<[Option<ActiveEraInfo>, Option<EraIndex>]>([
        api.query.staking.activeEra,
        api.query.staking.currentEra
    ]);
    const entity = new ValidatorThreshold(block.block.header.number.toString());
    if (activeEra.isEmpty){
        await entity.save();
        return;
    }
    const validators = await api.query.session.validators();
    const exposureInfos = await api.query.staking.erasStakers.multi<Exposure>(validators.map(validator=>[activeEra.unwrap().index, validator]));
    const thresholdValidator = exposureInfos.reduce<{accountId: string, total: Balance}>((acc, exposure, idx)=>{
        if (!acc || exposure.total.unwrap().lt(acc.total)) {
            return {accountId: validators[idx].toString(), total: exposure.total.unwrap()};
        }
        return acc;
    }, undefined );
    entity.activeEra = activeEra.unwrap().index.toNumber();
    entity.currentEra = currentEra.unwrap()?.toNumber();
    entity.totalValidators = validators.length;
    entity.validatorWithLeastBond = thresholdValidator.accountId;
    entity.leastStaked = thresholdValidator.total.toBigInt();
    entity.totalStaked = (await api.query.staking.erasTotalStake(activeEra.unwrap().index)).toBigInt();
    entity.maxNominatorRewardedPerValidator = api.consts.staking.maxNominatorRewardedPerValidator?.toNumber();
    await entity.save();
}