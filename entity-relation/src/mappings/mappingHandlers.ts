import {SubstrateExtrinsic,SubstrateEvent} from "@subql/types";
import {Account} from "../types/models/Account";
import {Transfer} from "../types/models/Transfer";
import {Call} from "../types/models/Call";
import {Balance} from "@polkadot/types/interfaces";
import {Vec, GenericCall} from "@polkadot/types"


function createAccount(accountId: string): Account {
    const entity = new Account(accountId);
    return entity;
}
export async function handleTransfer(event: SubstrateEvent): Promise<void> {
    const {event: {data: [from, to, amount]}} = event;
    const fromAccount = await Account.get(from.toString());
    if (!fromAccount){
        await createAccount(from.toString()).save();
    }
    const toAccount = await Account.get(to.toString());
    if(!toAccount){
        await createAccount(to.toString()).save();
    }
    const transferInfo = new Transfer(`${event.block.block.header.number.toNumber()}-${event.idx}`);
    transferInfo.fromId = from.toString();
    transferInfo.toId = to.toString();
    transferInfo.amount = (amount as Balance).toBigInt();
    await transferInfo.save();
}


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





