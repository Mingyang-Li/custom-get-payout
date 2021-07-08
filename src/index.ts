import { useOwnEraRewards } from './useOwnEraRewards';

async function main(){
    const r = useOwnEraRewards();
    r.then((res) => console.log(res));
}

main();