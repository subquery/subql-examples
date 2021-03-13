import {SubstrateEvent} from "@subql/types";
import {Account} from "../types/models/Account";
import {Transfer} from "../types/models/Transfer";
import {Balance} from "@polkadot/types/interfaces";


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



