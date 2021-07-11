import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {Button} from "react-bootstrap";
import {CreatePacketForm} from "./CreatePacketForm";
import {Defungify, DefungifyFactory, IERC20, IERC20Metadata__factory} from "./typechain";
import {useEffect, useState} from "react";
import {BigNumber} from "ethers";
import {formatUnits} from "ethers/lib/utils";
import {Allowance} from "./Allowance";


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

    // Updates ERC-20 token balance on every block.
    useEffect(() => {
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

        // Register listener
        console.log("Registering listener for ERC-20 information");
        web3.library?.on("block", updateTokenBalance);

        // Cleanup
        return () => {
            console.log("Removing listener for ERC-20 information");
            web3.library?.removeListener("block", updateTokenBalance);
        }

    }, [props.erc20.address, web3.account, web3.library, web3.chainId])

    // Updates ERC-20 information on token acquire
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