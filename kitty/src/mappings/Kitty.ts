import {KittyBirthInfo} from '../types/models/KittyBirthInfo';
import {SubstrateEvent, SubstrateExtrinsic} from "@subql/types";

export async function handleKittyCreated(event: SubstrateEvent): Promise<void> {
    const {event: {data: [owner, kittyId, kitty]}} = event;
    const record = new KittyBirthInfo(kittyId.toString());
    record.birthBlockHeight = event.block.block.header.number.toBigInt();
    record.firstOwner = owner.toString();
    record.owner = owner.toString();
    await record.save();
}

export async function handleKittyBred(extrinsic: SubstrateExtrinsic): Promise<void> {
    const bredEvent = extrinsic.events.find(e => e.event.section === 'kitties' && e.event.method === 'KittyBred');
    const {event: {data: [owner, kittyId, kitty]}} = bredEvent;
    const record = new KittyBirthInfo(kittyId.toString());
    record.birthBlockHeight = extrinsic.block.block.header.number.toBigInt();
    record.firstOwner = owner.toString();
    record.owner = owner.toString();
    const {extrinsic: {method: {args: [kittyId1, kittyId2]}}} = extrinsic;
    record.parent1 = kittyId1.toString();
    record.parent2 = kittyId2.toString();
    await record.save();
}

export async function handleKittyTransferred(event: SubstrateEvent): Promise<void> {
    const {event: {data: [from, to, kittyId]}} = event;
    const record = await KittyBirthInfo.get(kittyId.toString());
    record.owner = to.toString();
    await record.save();
}

//For demonstration only
export async function kittyApiHandler(): Promise<void> {
    //return the KittyIndex type
    const nextKittyId = await api.query.kitties.nextKittyId();
    // return the Kitty type, input parameters types are AccountId and KittyIndex
    const allKitties  = await api.query.kitties.kitties('xxxxxxxxx',123)
    // return kitty price as Balance type, take BlockHash and KittyIndex for inputs.
    // This feature is not support yet, wait to complete https://github.com/subquery/subql/issues/302
    const kittyPrice = await api.rpc.kitties.getKittyPrice(undefined,nextKittyId);
    logger.info(`Next kitty id ${nextKittyId}`)
}
