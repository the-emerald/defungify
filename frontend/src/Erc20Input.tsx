import {Col, Form} from "react-bootstrap";
import {ethers} from "ethers";

export interface Erc20InputProps {
    setErc20: any
}

export function Erc20Input(props: Erc20InputProps) {
    const onBlur = (event: any) => {
        const form = event.currentTarget;
        try {
            const address = ethers.utils.getAddress(form.erc20Input.value);
            props.setErc20(address);
        }
        catch (e) {
            alert("Not a valid address!");
            return;
        }
    }

    return(
        <div>
            <Form onBlur={onBlur}>
                <Form.Row>
                    <Col xs={4}>
                        <Form.Group controlId="erc20Input">
                            <Form.Label>ERC-20 token address</Form.Label>
                            <Form.Control placeholder="0x..."/>
                        </Form.Group>
                    </Col>
                </Form.Row>
            </Form>
        </div>
    )
}