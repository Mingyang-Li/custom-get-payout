import { useOwnEraRewards } from './useOwnEraRewards';
import { getEraPayout } from './getEraPayout';


async function main(){
    const data = {
        eraNumber: 2436,
        validatorId: "8162390"
    }
    const r = getEraPayout(data.eraNumber, data.validatorId);
    r.then((res) => console.table(res));
}

main();


// current era + 84 onwards is the era number we're interested in finding out more about their payout information

// given a block hash, era number and validator id, check if it's necessary to know if a payout is claimed (only check beyond historical block)

// session (event) < era, meaning many sessions in an era. 
// 1 session = 4 hours
// 1 era = 24h hours
// 1 era = 6 sessions

// at start of new session, if new era, era increased meaning all prev payout might be claimed. Now there's a list a val. 

// for every reward event, there's an extrinsic => it tells:
// 1. Who claimed the payouts
// 2. It is claimed by system (which means there'll be no extrinsic events and we need to find which era has payout claimed if this is the case) 

// era: 2435
// claimed at block hash: 0xc9845b0733e6319ab537d6801dcaba46110003e6dffaa4a2cb5f0a78ba872dd3
// block hash from this url: https://kusama.subscan.io/block/8162390?tab=extrinsic
// validator: https://kusama.subscan.io/block/8162390?tab=extrinsic