import {Button, Col, Form} from "react-bootstrap";
import {ethers} from "ethers";
import {IERC20__factory} from "./typechain";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";

export let presetErc20s: Map<number, Array<[string, string]>> = new Map();
presetErc20s.set(1, []);
presetErc20s.set(100, [["0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d", "wxDAI"]]);
presetErc20s.set(4, []);

export interface Erc20InputProps {
    setErc20: any
}

export function Erc20Input(props: Erc20InputProps) {
    const web3 = useWeb3React<Web3Provider>();

    const onBlur = (event: any) => {
        const form = event.currentTarget;
        try {
            const address = ethers.utils.getAddress(form.erc20Input.value);
            props.setErc20(IERC20__factory.connect(address, web3.library!));
        }
        catch (e) {
            if (form.erc20Input.value !== "") {
                alert("Not a valid address!");
            }
            return;
        }
    }

    const onClick = (address: string) => {
        props.setErc20(IERC20__factory.connect(address, web3.library!));
        return undefined;
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
                    {
                        presetErc20s.has(web3.chainId!) ?
                            presetErc20s.get(web3.chainId!)!.map(([address, name]) =>
                                <Col xs={1} className="mt-4" key={address}>
                                    <Button onClick={() => onClick(address)}>{name}</Button>
                                </Col>
                            )
                            :
                            <div/>
                    }
                </Form.Row>
            </Form>
        </div>
    )
}