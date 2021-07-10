import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import {BigNumber} from "ethers";
import {formatEther} from "ethers/lib/utils";

let chainNames: Map<number, string> = new Map();
chainNames.set(1, "mainnet");
chainNames.set(100, "xdai");
chainNames.set(4, "rinkeby (TESTNET)")

let nativeTokenNames: Map<number, string> = new Map();
nativeTokenNames.set(1, "ETH");
nativeTokenNames.set(100, "xDAI");
nativeTokenNames.set(4, "ETH")

export function AccountInfo() {
    const web3 = useWeb3React<Web3Provider>();
    const [nativeBalance, setNativeBalance] = useState<BigNumber | null>(null);

    useEffect(() => {
        web3.library!.on("block", () => {
            web3.library!.getBalance(web3.account!).then((r) => {
                setNativeBalance(r);
            })
        })
    })

    const onClick = async () => {
        web3.deactivate();
    }

    return(
        <div>
            <p><b>Address</b>: {web3.account}</p>
            <p><b>Chain</b>: {chainNames.get(web3.chainId!) ?? `Unknown chain ${web3.chainId}`}</p>
            <p><b>Balance</b>: {
                (nativeBalance == null) ? "..." : parseFloat(formatEther(nativeBalance)).toFixed(5)
            } {nativeTokenNames.get(web3.chainId!)}</p>
            <Button onClick={onClick}>Disconnect</Button>
        </div>
    )
}