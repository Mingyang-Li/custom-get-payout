import { ApiPromise, WsProvider } from '@polkadot/api';
import { BlockHash } from '@polkadot/types/interfaces';

export async function getEraPayout(eraNumber: number, validatorId: string) {
    // api initialisation
    const provider = new WsProvider('wss://kusama-rpc.polkadot.io/')
    const api = await ApiPromise.create({ provider});

    // generating blockhash based on validator ID param
    const blockHash: BlockHash = await api.rpc.chain.getBlockHash(parseInt(validatorId));

    // Checking payouts from this particulat era
    const allEraPayouts = await api.derive.accounts.accountId("0xc9845b0733e6319ab537d6801dcaba46110003e6dffaa4a2cb5f0a78ba872dd3");

    // Checking which payouts are claimed and unclaimed

    // For all claimed payouts, find out who claimed them.

    // For all payouts claimed by the system, find out which era did each payout happen within

    return allEraPayouts;
}