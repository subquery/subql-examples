import {SignedBlock} from "@polkadot/types/interfaces";
import {Extrinsic} from "../types/models/Extrinsic";

export async function handleBlock(thisBlock: SignedBlock): Promise<void> {
    const blockHash = thisBlock.block.header.hash.toString();

    await Promise.all(thisBlock.block.extrinsics.map(async extrinsic => {
        if (extrinsic.isSigned) {
            const origin = extrinsic.signer.toString();
            const entity = new Extrinsic(extrinsic.hash.toString());
            entity.blockHash = blockHash;
            entity.blockHeight = thisBlock.block.header.number.toBigInt();
            entity.origin = origin;
            await entity.save();
        }
    }));

}
