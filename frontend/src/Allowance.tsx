import {Button} from "react-bootstrap";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {Defungify, IERC20} from "./typechain";
import {BigNumber} from "ethers";

export interface AllowanceProps {
    defungify: Defungify,
    erc20: IERC20,
}

export function Allowance(props: AllowanceProps) {
    const web3 = useWeb3React<Web3Provider>();

    const onClick = async () => {
        const receipt = await props.erc20
            .connect(web3.library?.getSigner()!)
            .approve(props.defungify.address, BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"));
        await receipt.wait();
    }

    return (
        <div className="my-2">
            <Button onClick={onClick}>Approve spending</Button>
        </div>
    )
}