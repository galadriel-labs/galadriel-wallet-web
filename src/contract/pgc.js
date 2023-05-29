import { BigNumber, Contract, ethers, Overrides } from 'ethers';
import cfg from './abiConfig'
import { formatEther, parseEther } from 'ethers/lib/utils';

class PGC {
    constructor() {
        const newProvider = new ethers.providers.Web3Provider(window.ethereum)
        this.provider = newProvider
        this.signer = newProvider.getSigner(0);
        // this.PGCContract = new Contract(cfg['pgc'].address, cfg['pgc'].abi, this.signer);
    }
    gasOptions(gas) {
        const multiplied = Math.floor(gas.toNumber() * 1.2);
        // console.log(`⛽️ Gas multiplied: ${gas} -> ${multiplied}`);
        return {
          gasLimit: BigNumber.from(multiplied),
        };
    }
    
}

export default PGC
