import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {Button} from "react-bootstrap";
import {CreatePacketForm} from "./CreatePacketForm";
import {Defungify, DefungifyFactory, ERC20__factory, IERC20, IERC20Metadata__factory} from "./typechain";
import {useEffect, useState} from "react";
import {BigNumber} from "ethers";
import {formatUnits, hexZeroPad, id} from "ethers/lib/utils";
import {Allowance} from "./Allowance";
import {EventFilter} from "ethers/lib/ethers";


interface PacketDeployProps {
    erc20: IERC20;
    defungify: Defungify | null;
    dfFactory: DefungifyFactory;
}

export function PacketDeploy(props: PacketDeployProps) {
    const web3 = useWeb3React<Web3Provider>();

    const [name, setName] = useState<string | null>(null);
    const [symbol, setSymbol] = useState<string | null>(null);
    const [balance, setBalance] = useState<BigNumber | null>(null);
    const [decimals, setDecimals] = useState<number | null>(null);

    const deployNewDf = async () => {
        const receipt = await props.dfFactory.connect(web3.library?.getSigner()!).deployDf(props.erc20.address);
        await receipt.wait();
    }

    // Updates ERC-20 token balance on send and receive
    useEffect(() => {
        const erc20 = ERC20__factory.connect(props.erc20.address, web3.library!);
        // Function called on new block
        const updateTokenBalance = async () => {
            const metadata = IERC20Metadata__factory.connect(props.erc20.address, web3.library!);
            console.log("Fetching ERC-20 balance");
            try {
                const balanceOf = await metadata.balanceOf(web3.account!);
                setBalance(balanceOf);
            } catch (e) {
                console.log(e);
                alert("Error while fetching ERC-20 token");
            }
        }

        // Register listeners
        const filterTransferOut: EventFilter = {
            address: erc20.address,
            topics: [
                id("Transfer(address,address,uint256)"),
                hexZeroPad(web3.account!, 32)
            ]
        };

        const filterTransferIn: EventFilter = {
            address: erc20.address,
            topics: [
                id("Transfer(address,address,uint256)"),
                // @ts-ignore
                null,
                hexZeroPad(web3.account!, 32)
            ]
        };

        erc20.on(filterTransferIn, updateTokenBalance);
        erc20.on(filterTransferOut, updateTokenBalance);
        updateTokenBalance().then(() => {});

        // Cleanup
        return () => {
            console.log("Removing listener for ERC-20 information");
            erc20.removeAllListeners();
        }

    }, [props.erc20.address, web3.account, web3.library, web3.chainId])

    // Updates ERC-20 information on token address update
    useEffect(() => {
        const getTokenInformation = async () => {
            const metadata = IERC20Metadata__factory.connect(props.erc20.address, web3.library!);
            console.log("Fetching ERC-20 Information");
            try {
                const name = await metadata.name();
                setName(name);
                const symbol = await metadata.symbol();
                setSymbol(symbol);
                const decimals = await metadata.decimals();
                setDecimals(decimals);
            }
            catch (e) {
                console.log(e);
                alert("Error while fetching ERC-20 token");
            }
        }

        getTokenInformation().then(() => {});
    }, [props.erc20.address, web3.account, web3.library, web3.chainId])

    return (
        <div>
            <p><b>Token name</b>: {name}</p>
            <p><b>Token symbol</b>: {symbol}</p>
            <p><b>Balance</b>: {formatUnits(balance ?? 0, decimals!)}</p>
            {
                (props.defungify != null) ?
                    <div>
                        <Allowance defungify={props.defungify} erc20={props.erc20}/>
                        <CreatePacketForm defungify={props.defungify} decimals={decimals!}/>
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