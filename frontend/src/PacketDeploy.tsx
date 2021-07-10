import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {Button} from "react-bootstrap";
import {CreatePacketForm} from "./CreatePacketForm";
import {DefungifyFactory__factory, IERC20Metadata__factory} from "./typechain";
import {useEffect, useState} from "react";
import {factoryLocation} from "./factoryLocation";
import {BigNumber} from "ethers";
import {formatEther} from "ethers/lib/utils";

interface PacketDeployProps {
    address: string;
}

export function PacketDeploy(props: PacketDeployProps) {
    const web3 = useWeb3React<Web3Provider>();
    const [name, setName] = useState<string | null>(null);
    const [symbol, setSymbol] = useState<string | null>(null);
    const [balance, setBalance] = useState<BigNumber | null>(null);
    const [defungifyAddress, setDefungifyAddress] = useState<string | null>(null);

    const targetErc20 = IERC20Metadata__factory.connect(props.address, web3.library!);
    const dfFactory = DefungifyFactory__factory.connect(factoryLocation.get(web3.chainId!)!, web3.library!);

    const deployNewDf = async () => {
        const receipt = await dfFactory.connect(web3.library?.getSigner()!).deployDf(targetErc20.address);
        await receipt.wait();

        const deployedAddress = await dfFactory.deployedContracts(props.address);
        if (deployedAddress === "0x0000000000000000000000000000000000000000") {
            alert("Deployment failed");
            setDefungifyAddress(null);
        }
        else {
            setDefungifyAddress(deployedAddress);
        }
    }

    const handleErcError = (e: any) => {
        console.log(e);
        alert("Error while fetching ERC-20 token");
    }

    useEffect(() => {
        if (symbol == null) {
            targetErc20.name().then(r => {
                setName(r)
            })
                .catch((e) => handleErcError(e));
        }
        if (symbol == null) {
            targetErc20.symbol().then(r => {
                setSymbol(r)
            })
        }
        if (balance == null) {
            targetErc20.balanceOf(web3.account!).then(r => {
                setBalance(r);
            })
        }
        if (defungifyAddress == null) {
            dfFactory.deployedContracts(props.address).then(r => {
                if (r === "0x0000000000000000000000000000000000000000") {
                    setDefungifyAddress(null);
                }
                else {
                    setDefungifyAddress(r);
                }
            })
        }
    }, [name, symbol, balance, defungifyAddress, targetErc20, web3.account, dfFactory, props.address])

    return (
        <div>
            <p><b>Token name</b>: {name}</p>
            <p><b>Token symbol</b>: {symbol}</p>
            <p><b>Balance</b>: {formatEther(balance ?? 0)}</p>
            {
                (defungifyAddress != null) ?
                    <CreatePacketForm/>
                    :
                    <div>
                    <p>No Defungify contract exists for that token. Be the first to deploy it.</p>
                    <Button onClick={deployNewDf}>Deploy</Button>
                    </div>
            }
        </div>
    )
}