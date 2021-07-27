import {SumReward} from '../types/models/SumReward';
import {SubstrateEvent} from "@subql/types";
import {Balance} from '@polkadot/types/interfaces';
import {NoBondRecordAccount} from "../types/models/NoBondRecordAccount";

function createSumReward(accountId: string): SumReward {
    const entity = new SumReward(accountId);
    entity.accountReward = BigInt(0);
    entity.accountSlash = BigInt(0);
    entity.accountTotal = BigInt(0);
    return entity;
}

export async function handleBond(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, balance]}} = event;
    const entity = await SumReward.get(account.toString());
    if (entity === undefined){
        await createSumReward(account.toString()).save();
    }
}


export async function handleReward(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, newReward]}} = event;
    let entity = await SumReward.get(account.toString());
    if (entity === undefined){
        // in early stage of kusama, some validators didn't need to bond to start staking
        // to not break our code, we will create a SumReward record for them and log them in NoBondRecordAccount
        entity = createSumReward(account.toString());
        const errorRecord = new NoBondRecordAccount(account.toString());
        errorRecord.firstRewardAt = event.block.block.header.number.toNumber();
        await errorRecord.save();
    }

    entity.accountReward = entity.accountReward + (newReward as Balance).toBigInt();
    entity.accountTotal = entity.accountReward - entity.accountSlash;
    await entity.save();
}

export async function handleSlash(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, newSlash]}} = event;
    let entity = await SumReward.get(account.toString());
    if (entity === undefined){
        // in early stage of kusama, some validators didn't need to bond to start staking
        // to not break our code, we will create a SumReward record for them and log them in NoBondRecordAccount
        entity = createSumReward(account.toString());
        const errorRecord = new NoBondRecordAccount(account.toString());
        errorRecord.firstRewardAt = event.block.block.header.number.toNumber();
        await errorRecord.save();
    }

    entity.accountSlash = entity.accountSlash + (newSlash as Balance).toBigInt();
    entity.accountTotal = entity.accountReward - entity.accountSlash;
    await entity.save();
}
