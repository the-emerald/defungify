import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {Button} from "react-bootstrap";
import {CreatePacketForm} from "./CreatePacketForm";
import {Defungify, Defungify__factory, DefungifyFactory__factory, IERC20, IERC20Metadata__factory} from "./typechain";
import {useEffect, useState} from "react";
import {factoryLocation} from "./factoryLocation";
import {BigNumber} from "ethers";
import {formatEther} from "ethers/lib/utils";
import {Allowance} from "./Allowance";

interface PacketDeployProps {
    erc20: IERC20;
}

export function PacketDeploy(props: PacketDeployProps) {
    const web3 = useWeb3React<Web3Provider>();

    const [name, setName] = useState<string | null>(null);
    const [symbol, setSymbol] = useState<string | null>(null);
    const [balance, setBalance] = useState<BigNumber | null>(null);
    const [defungify, setDefungify] = useState<Defungify | null>(null);

    const metadata = IERC20Metadata__factory.connect(props.erc20.address, web3.library!);
    const dfFactory = DefungifyFactory__factory.connect(factoryLocation.get(web3.chainId!)!, web3.library!);

    const deployNewDf = async () => {
        const receipt = await dfFactory.connect(web3.library?.getSigner()!).deployDf(metadata.address);
        await receipt.wait();

        const deployedAddress = await dfFactory.deployedContracts(props.erc20.address);
        if (deployedAddress === "0x0000000000000000000000000000000000000000") {
            alert("Deployment failed");
            setDefungify(null);
        }
        else {
            setDefungify(Defungify__factory.connect(deployedAddress, web3.library!));
        }
    }

    const handleErcError = (e: any) => {
        console.log(e);
        alert("Error while fetching ERC-20 token");
    }

    useEffect(() => {
        if (symbol == null) {
            metadata.name().then(r => {
                setName(r)
            })
                .catch((e) => handleErcError(e));
        }
        if (symbol == null) {
            metadata.symbol().then(r => {
                setSymbol(r)
            })
        }
        if (balance == null) {
            metadata.balanceOf(web3.account!).then(r => {
                setBalance(r);
            })
        }
        if (defungify == null) {
            dfFactory.deployedContracts(props.erc20.address).then(r => {
                if (r === "0x0000000000000000000000000000000000000000") {
                    setDefungify(null);
                }
                else {
                    setDefungify(Defungify__factory.connect(r, web3.library!));
                }
            })
        }
    }, [name, symbol, balance, defungify, metadata, web3.account, web3.library, dfFactory, props.erc20])

    return (
        <div>
            <p><b>Token name</b>: {name}</p>
            <p><b>Token symbol</b>: {symbol}</p>
            <p><b>Balance</b>: {formatEther(balance ?? 0)}</p>
            {
                (defungify != null) ?
                    <div>
                        <Allowance defungify={defungify} erc20={props.erc20}/>
                        <CreatePacketForm defungify={defungify}/>
                    </div>
                    :
                    <div>
                    <p>No Defungify contract exists for that token. Be the first to deploy it.</p>
                    <Button onClick={deployNewDf}>Deploy</Button>
                    </div>
            }
        </div>
    )
}