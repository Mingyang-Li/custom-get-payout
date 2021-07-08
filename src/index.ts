import { useOwnEraRewards } from './useOwnEraRewards';

async function main(){
    const r = useOwnEraRewards(2890);
    r.then((res) => console.log(`returned state: ${r}`));
}

main();