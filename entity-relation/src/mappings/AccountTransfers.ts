import { SubstrateEvent } from '@subql/types';
import { Account } from '../types/models/Account';
import { Transfer } from '../types/models/Transfer';
import { Balance } from '@polkadot/types/interfaces';

async function ensureAccounts(accountIds: string[]): Promise<void> {
    for (const accountId of accountIds) {
        const account = await Account.get(accountId);
        if (!account) {
            await new Account(accountId).save();
        }
    }
}

export async function handleTransfer(event: SubstrateEvent): Promise<void> {
    const {
        event: {
            data: [from, to, amount],
        },
    } = event;
    await ensureAccounts([from.toString(), to.toString()]);
    const transferInfo = new Transfer(
        `${event.block.block.header.number.toNumber()}-${event.idx}`,
    );
    transferInfo.fromId = from.toString();
    transferInfo.toId = to.toString();
    transferInfo.amount = (amount as Balance).toBigInt();
    await transferInfo.save();
}
