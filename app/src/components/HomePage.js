import { Web3Button } from "@web3modal/react";
import {useContractRead, useContractWrite} from 'wagmi';
import {utils, BigNumber} from 'ethers'
import { VENDINGMACHINE_ABI, VENDINGMACHINE_ADDRESS, ZCDTOKEN_ABI, ZCDTOKEN_ADDRESS } from "./constants";



function HomePage () {
    "use strict"

    const { write: chargePepsiInStock} = useContractWrite({
        address: VENDINGMACHINE_ADDRESS,
        abi: VENDINGMACHINE_ABI,
        functionName: "chargePepsiInStock",
        args: [4],
        overrides: {
            gasLimit: 80000
        }
    })

    const {refetch: getPepsiInStock} = useContractRead({
        address: VENDINGMACHINE_ADDRESS,
        abi: VENDINGMACHINE_ABI,
        functionName: "getPepsiInStock",
        onSuccess(data) {
            console.log(data)
        }
    })

    const {write: approve} = useContractWrite({
        address: ZCDTOKEN_ADDRESS,
       abi: ZCDTOKEN_ABI,
       functionName: "approve",
       args: [VENDINGMACHINE_ADDRESS,"10000000000000000000" ]
        
    })

    const { write: purchase } = useContractWrite({
        address: VENDINGMACHINE_ADDRESS,
        abi: VENDINGMACHINE_ABI,
        functionName: "purchase",
        args: [1],
        overrides: {
            gasLimit: 80000
        }
    })
    return (
        <div className="Home">
            <Web3Button />
            <div>
                <button onClick={chargePepsiInStock} >
                    charge
                </button>
                <button onClick={purchase} >
                    purchase
                </button>
                <button onClick={getPepsiInStock}>
                    get
                </button>
                <button onClick={approve}>
                    approve
                </button>
            </div>
        </div>
    )
}

export default HomePage;