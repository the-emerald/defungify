import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";

export function DepositDeploy() {
    const web3 = useWeb3React<Web3Provider>();

    return (
        <div>
            <p>Deposit / deploy</p>
        </div>
    )
}