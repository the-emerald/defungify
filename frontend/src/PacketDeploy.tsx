import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {Button} from "react-bootstrap";
import {CreatePacketForm} from "./CreatePacketForm";

export function PacketDeploy() {
    const web3 = useWeb3React<Web3Provider>();

    // FIXME: Hook this up using typechain
    const contractExists = true;

    // FIXME: Deploy contract
    const deploy = () => {
        alert("Deploy")
    }

    return (
        <div>
            {
                contractExists ?
                    <div>
                        <p><b>Token name</b>: Placeholder</p>
                        <p><b>Token symbol</b>: Placeholder</p>
                        <CreatePacketForm/>
                    </div>
                    :
                    <div>
                    <p>No Defungify contract exists for that token. Be the first to deploy it.</p>
                    <Button onClick={deploy}>Deploy</Button>
                    </div>
            }
        </div>
    )
}