import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {InjectedConnector} from "@web3-react/injected-connector";
import {Button} from "react-bootstrap";

export const injectedConnector = new InjectedConnector({
    supportedChainIds: [
        1, // Mainet
        3, // Ropsten
        4, // Rinkeby
        5, // Goerli
        42, // Kovan
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
                <div>
                    <p>Address: {web3.account}</p>
                    <p>Chain: {web3.chainId}</p>
                </div>
            ) : <Button onClick={onClick}>Connect to MetaMask</Button> }
        </div>
    )
}