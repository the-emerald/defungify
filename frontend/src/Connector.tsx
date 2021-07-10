import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {InjectedConnector} from "@web3-react/injected-connector";
import {Button} from "react-bootstrap";
import {AccountInfo} from "./AccountInfo";

export const injectedConnector = new InjectedConnector({
    supportedChainIds: [
        1, // Mainnet
        100, // xDAI
    ],
})

export function Connector() {
    const web3 = useWeb3React<Web3Provider>();

    const onClick = async () => {
        await web3.activate(injectedConnector);
    }

    return (
        <div>
            { web3.active ? (
                <AccountInfo/>
            ) : <Button onClick={onClick}>Connect to MetaMask</Button> }
        </div>
    )
}