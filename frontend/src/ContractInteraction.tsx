import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";

export function ContractInteraction() {
    const web3 = useWeb3React<Web3Provider>();

    return (
        <div>
            <p>TODO Enter ERC-20 contract here</p>
        </div>
    )
}