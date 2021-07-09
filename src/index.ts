import { useOwnEraRewards } from './useOwnEraRewards';

async function main(){
    const r = useOwnEraRewards(2890);
    r.then((res) => console.log(`returned state: ${r}`));
}

main();


// current era + 84 onwards

// given a block hash, era number and validator id

// to check if it's necessary to know if a payout is claimed, only check beyond historical block

// session (event) < era 

// at start of new session, if new era, era increased meaning all prev payout might be claimed. Now there's a list a val. 

// for every reward event, there's an extrinsic => it tells who claimed or claimed by system (no extrinsic) => need to find which era has payout claimed    

// era: 2435
// claimed at block: https://kusama.subscan.io/block/8162390?tab=extrinsic
// validator: https://kusama.subscan.io/block/8162390?tab=extrinsic