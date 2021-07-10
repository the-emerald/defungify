import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";

export function ShowBurn() {
    const web3 = useWeb3React<Web3Provider>();

    return (
        <div>
            <h4>Your packets</h4>
        </div>
    )
}