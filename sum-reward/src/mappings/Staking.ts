import {StakingReward, StakingSlash} from '../types/models';
import {SubstrateEvent} from "@subql/types";
import {Balance} from '@polkadot/types/interfaces';

export async function handleStakingRewarded(event: SubstrateEvent): Promise<void> {
    await handleStakingReward(event)
}

export async function handleStakingReward(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, newReward]}} = event;
    const entity = new StakingReward(`${event.block.block.header.number}-${event.idx.toString()}`);
    entity.accountId = account.toString();
    entity.balance = (newReward as Balance).toBigInt();
    entity.date = event.block.timestamp;
    await entity.save();
}

export async function handleStakingSlashed(event: SubstrateEvent): Promise<void> {
    await handleStakingSlash(event)
}

export async function handleStakingSlash(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, newSlash]}} = event;
    const entity = new StakingSlash(`${event.block.block.header.number}-${event.idx.toString()}`);
    entity.accountId = account.toString();
    entity.balance = (newSlash as Balance).toBigInt();
    entity.date = event.block.timestamp;
    await entity.save();
}
