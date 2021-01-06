import {BlockTs} from '../types/models/BlockTs';
import {SubstrateExtrinsic} from "@subql/types";
import {Compact} from '@polkadot/types';
import {Moment} from '@polkadot/types/interfaces';

export async function handleTimestampSet(extrinsic: SubstrateExtrinsic): Promise<void> {
    const record = new BlockTs(extrinsic.block.block.header.hash.toString());
    record.blockHeight = extrinsic.block.block.header.number.toBigInt();
    const moment = extrinsic.extrinsic.args[0] as Compact<Moment>;
    record.timestamp = new Date(moment.toNumber());
    await record.save();
}
