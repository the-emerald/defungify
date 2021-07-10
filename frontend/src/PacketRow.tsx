import {Packet} from "./PacketsList";
import {Button} from "react-bootstrap";
import {formatEther} from "ethers/lib/utils";
import {Defungify} from "./typechain";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";

export interface PacketRowProps {
    packet: Packet,
    defungify: Defungify
}

export function PacketRow(props: PacketRowProps) {
    const web3 = useWeb3React<Web3Provider>();

    const clickBurn = async () => {
        const receipt = await props.defungify.connect(web3.library?.getSigner()!).burn(props.packet.id);
        await receipt.wait();
    }

    const clickTransfer = async () => {
        alert("Transfer");
    }

    return (
        <tr>
            <td>{props.packet.id}</td>
            <td>{formatEther(props.packet.amount)}</td>
            <td>{props.packet.message}</td>
            <td><Button variant="danger" onClick={clickBurn}>Burn</Button></td>
            <td><Button onClick={clickTransfer}>Transfer</Button></td>
        </tr>
    )
}