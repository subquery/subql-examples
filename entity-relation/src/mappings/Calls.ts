import {SubstrateExtrinsic} from "@subql/types";
import {Call} from "../types/models/Call";
import {Vec} from "@polkadot/types"
import {AnyTuple, CallBase} from "@polkadot/types/types"
import {flatDeep} from "./utils/flatten";

function extractCalls(call: CallBase<AnyTuple>, id: number, parentCallId:string,isExtrinsic:boolean): Call[]{
    const callId = `${parentCallId}-${id}`
    const entity = new Call(callId);
    const entities = [] as Call[];
    entity.method = call.method
    entity.module = call.section;
    entity.parentCallId = isExtrinsic? null: parentCallId;
    entities.push(entity);
    if (call.method == 'batchAll' && call.section == 'utility'){
        const calls = call.args[0] as Vec<CallBase<AnyTuple>>
        return entities.concat(flatDeep((calls.map((call,idx) =>
            extractCalls(call,idx,callId,false)
        )),Infinity));
    }else{
        return entities;
    }
}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void>{
    const calls =  extractCalls(extrinsic.extrinsic.method,extrinsic.idx,extrinsic.block.block.header.number.toString(),true)
    await Promise.all(calls.map((call) => call.save()))

}





