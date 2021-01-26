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
