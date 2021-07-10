import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {Button} from "react-bootstrap";
import {CreatePacketForm} from "./CreatePacketForm";
import {Defungify, Defungify__factory, DefungifyFactory__factory, IERC20, IERC20Metadata__factory} from "./typechain";
import {useEffect, useState} from "react";
import {factoryLocation} from "./factoryLocation";
import {BigNumber, EventFilter} from "ethers";
import {formatEther, hexZeroPad, id} from "ethers/lib/utils";
import {Allowance} from "./Allowance";

interface PacketDeployProps {
    erc20: IERC20;
    setDefungify: any;
    defungify: Defungify | null
}

export function PacketDeploy(props: PacketDeployProps) {
    const web3 = useWeb3React<Web3Provider>();

    const [name, setName] = useState<string | null>(null);
    const [symbol, setSymbol] = useState<string | null>(null);
    const [balance, setBalance] = useState<BigNumber | null>(null);

    const metadata = IERC20Metadata__factory.connect(props.erc20.address, web3.library!);
    const dfFactory = DefungifyFactory__factory.connect(factoryLocation.get(web3.chainId!)!, web3.library!);

    const deployNewDf = async () => {
        const receipt = await dfFactory.connect(web3.library?.getSigner()!).deployDf(metadata.address);
        await receipt.wait();

        const deployedAddress = await dfFactory.deployedContracts(props.erc20.address);
        if (deployedAddress === "0x0000000000000000000000000000000000000000") {
            alert("Deployment failed");
            props.setDefungify(null);
        }
        else {
            props.setDefungify(Defungify__factory.connect(deployedAddress, web3.library!));
        }
    }

    const handleErcError = (e: any) => {
        console.log(e);
        alert("Error while fetching ERC-20 token");
    }

    useEffect(() => {
        if (name == null) {
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
    }, [name, symbol, balance, metadata, web3.account, web3.library])

    useEffect(() => {
        if (props.defungify == null) {
            dfFactory.deployedContracts(props.erc20.address).then(r => {
                if (r === "0x0000000000000000000000000000000000000000") {
                    props.setDefungify(null);
                }
                else {
                    props.setDefungify(Defungify__factory.connect(r, web3.library!));
                }
            })
        }
    }, [dfFactory, props, web3.library]);

    useEffect(() => {
        const filterTransferOut: EventFilter = {
            address: props.erc20.address,
            topics: [
                id("Transfer(address,address,uint256)"),
                hexZeroPad(web3.account!, 32)
            ]
        };

        const filterTransferIn: EventFilter = {
            address: props.erc20.address,
            topics: [
                id("Transfer(address,address,uint256)"),
                // @ts-ignore
                null,
                hexZeroPad(web3.account!, 32)
            ]
        };

        props.erc20.on(filterTransferIn, () => {
            props.erc20.balanceOf(web3.account!).then((r) => {
                setBalance(r);
            })
        });

        props.erc20.on(filterTransferOut, () => {
            props.erc20.balanceOf(web3.account!).then((r) => {
                setBalance(r);
            })
        });
    }, [props.erc20, web3.account])

    return (
        <div>
            <p><b>Token name</b>: {name}</p>
            <p><b>Token symbol</b>: {symbol}</p>
            <p><b>Balance</b>: {formatEther(balance ?? 0)}</p>
            {
                (props.defungify != null) ?
                    <div>
                        <Allowance defungify={props.defungify} erc20={props.erc20}/>
                        <CreatePacketForm defungify={props.defungify}/>
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