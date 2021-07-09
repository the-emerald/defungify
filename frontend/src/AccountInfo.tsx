import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {Button} from "react-bootstrap";

let chainNames: Map<number, string> = new Map();
chainNames.set(1, "mainnet");
chainNames.set(100, "xdai");


export function AccountInfo() {
    const web3 = useWeb3React<Web3Provider>();

    const onClick = async () => {
        web3.deactivate();
    }

    return(
        <div>
            <p><b>Address</b>: {web3.account}</p>
            <p><b>Chain</b>: {chainNames.get(web3.chainId!) ?? `Unknown chain ${web3.chainId}`}</p>
            <Button onClick={onClick}>Disconnect</Button>
        </div>
    )
}