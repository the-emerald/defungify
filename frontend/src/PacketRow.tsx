import {Packet} from "./PacketsList";
import {Button} from "react-bootstrap";
import {formatEther} from "ethers/lib/utils";

export interface PacketRowProps {
    packet: Packet
}

export function PacketRow(props: PacketRowProps) {
    const clickBurn = async () => {
        alert("Burn");
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