import {SubstrateExtrinsic} from "@subql/types";
import {Call} from "../types/models/Call";
import {Vec, GenericCall} from "@polkadot/types"

async function createChildCall(call: GenericCall, id: string, parentCallId:string) {
    const callId = `${parentCallId}-${id}`
    const entity = new Call(callId);
    entity.method = call.method
    entity.module = call.section;
    entity.parentCallId = parentCallId;
    await entity.save();
    if (call.method == 'batchAll' && call.section == 'utility'){
        const calls = call.args[0] as Vec<GenericCall>
        for (const [id, childCall] of calls.entries()){
            await createChildCall(childCall,id.toString(),callId);
        }
    }
}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void>{
    const parentCallId = `${extrinsic.block.block.header.number.toNumber()}-${extrinsic.idx}`
    const parent = new Call(parentCallId);
    parent.method = extrinsic.extrinsic.method.method;
    parent.module = extrinsic.extrinsic.method.section;
    await parent.save();
    const calls = extrinsic.extrinsic.args[0] as Vec<GenericCall>
    for (const [id, call] of calls.entries()){
        await createChildCall(call,id.toString(),parentCallId);
    }
}





