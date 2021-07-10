import {Button, Col, Form} from "react-bootstrap";
import {useState} from "react";
import {Defungify} from "./typechain";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {parseEther} from "ethers/lib/utils";

export interface CreatePacketFormProps {
    defungify: Defungify
}

export function CreatePacketForm(props: CreatePacketFormProps) {
    const web3 = useWeb3React<Web3Provider>();
    const [validated, setValidated] = useState(false);

    const createPacket = async (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() !== false) {
            const receipt = await props.defungify
                .connect(web3.library?.getSigner()!)
                .safeMint(web3.account!, parseEther(form.packetAmount.value), form.packetMessage.value);
            await receipt.wait();
        }
        setValidated(true);
    }

    return (
        <div>
            <h4>Create a new packet</h4>
            <Form noValidate validated={validated} onSubmit={createPacket}>
                <Form.Row className="align-items-center">
                    <Col xs="auto">
                        <Form.Group controlId="packetAmount">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control required type="number" placeholder="0"/>
                            <Form.Control.Feedback type="invalid">Required</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Form.Row>
                <Form.Row className="align-items-center">
                    <Col xs={4}>
                        <Form.Group controlId="packetMessage">
                            <Form.Label>Message</Form.Label>
                            <Form.Control as="textarea" placeholder="Optional"/>
                        </Form.Group>
                    </Col>
                </Form.Row>
                <Button type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}