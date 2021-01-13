import {SumReward} from '../types/models/SumReward';
import {SubstrateEvent} from "@subql/types";
import {Balance} from '@polkadot/types/interfaces';

export async function handleBond(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, balance]}} = event;
    let entity:SumReward;
    try{
        entity = await SumReward.get(account.toString());
    }catch (e) {
        entity = new SumReward(account.toString());
        entity.accountReward = BigInt(0);
        entity.accountSlash = BigInt(0);
        entity.accountTotal = BigInt(0);
        await entity.save();
    }
}


export async function handleReward(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, balance]}} = event;
    const entity = await SumReward.get(account.toString());
    const newReward = balance as Balance;

    entity.accountReward = BigInt(entity.accountReward) + BigInt(newReward.toBigInt()) ;
    entity.accountTotal = BigInt(entity.accountReward) - BigInt(entity.accountSlash);
    await entity.save();
}


export async function handleSlash(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, balance]}} = event;
    const entity = await SumReward.get(account.toString());
    const newSlash = balance as Balance;

    entity.accountSlash = BigInt(entity.accountSlash) + BigInt(newSlash.toBigInt());
    entity.accountTotal = BigInt(entity.accountReward) - BigInt(entity.accountSlash);
    await entity.save();
}
