import {Packet} from "./PacketsList";
import {Button, Col, Form, Modal} from "react-bootstrap";
import {formatUnits} from "ethers/lib/utils";
import {Defungify} from "./typechain";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {useState} from "react";
import {ethers} from "ethers";

export interface PacketRowProps {
    packet: Packet,
    defungify: Defungify,
}

export function PacketRow(props: PacketRowProps) {
    const web3 = useWeb3React<Web3Provider>();
    const [showModal, setShowModal] = useState<boolean>(false);

    const clickBurn = async () => {
        const receipt = await props.defungify.connect(web3.library?.getSigner()!).burn(props.packet.id);
        await receipt.wait();
    }

    const clickTransfer = () => {
        setShowModal(true);
    }

    const handleClose = () => {
        setShowModal(false);
    }

    const transfer = async (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        try {
            ethers.utils.getAddress(form.sendAddress.value)
        }
        catch (e) {
            alert("Invalid address!");
            return;
        }

        const receipt = await props.defungify
            .connect(web3.library?.getSigner()!)
            ["safeTransferFrom(address,address,uint256)"](
                web3.account!,
                form.sendAddress.value,
                props.packet.id
        );
        handleClose();
        await receipt.wait();
    }

    return (
        <>
            <tr>
                <td>{props.packet.id}</td>
                <td>{formatUnits(props.packet.amount, props.packet.decimals)}</td>
                <td>{props.packet.message}</td>
                <td><Button variant="danger" onClick={clickBurn}>Burn</Button></td>
                <td><Button onClick={clickTransfer}>Transfer</Button></td>
            </tr>

            <Modal
                show={showModal}
                onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Send packet</Modal.Title>
                </Modal.Header>
                <Form onSubmit={transfer}>
                    <Modal.Body>
                        <Form.Group controlId="sendAddress">
                            <Form.Label>Destination address</Form.Label>
                            <Form.Control placeholder="0x..." required/>
                        </Form.Group>
                        <Form.Row>
                            <Col xs={2}>
                                <Form.Group controlId="sendId">
                                    <Form.Label>ID</Form.Label>
                                    <Form.Control placeholder={props.packet.id.toString()} disabled/>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button type="submit">
                            Send
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>

    )
}