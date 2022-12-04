import { Web3Button } from "@web3modal/react";
import {useAccount, useContractRead, useContractWrite} from 'wagmi';
import {utils, BigNumber} from 'ethers'
import { OWNER_ADDRESS, VENDINGMACHINE_ABI, VENDINGMACHINE_ADDRESS, ZCDTOKEN_ABI, ZCDTOKEN_ADDRESS } from "./constants";
import imageCocaCola from './images/coca-cola.png'
import imagePepsi from './images/pepsi.png'
import './HomePage.css'
import ReactLoading from "react-loading";
import { useState } from "react";
import {AiFillTwitterCircle, AiFillGithub} from 'react-icons/ai';

function HomePage () {
    "use strict"

    const [CocaColaInStock, setCocaColaInStock] = useState(0);
    const [PepsiInStock, setPepsiInStock] = useState(0);
    const account = useAccount();
    
    const { write: chargePepsiInStock, isLoading: isLoadingChargePepsiInStock} = useContractWrite({
        address: VENDINGMACHINE_ADDRESS,
        abi: VENDINGMACHINE_ABI,
        functionName: "chargePepsiInStock",
        args: [100],
        overrides: {
            gasLimit: 80000
        },
        onSuccess() {
            getPepsiInStock();
        }
    })
    const { write: chargeCocaColaInStock, isLoading: isLoadingChargeCocaColaInStock} = useContractWrite({
        address: VENDINGMACHINE_ADDRESS,
        abi: VENDINGMACHINE_ABI,
        functionName: "chargeCocaColaInStock",
        args: [100],
        overrides: {
            gasLimit: 80000
        },
        onSuccess(){
            getCocaColaInStock();
        }
    })


    const {refetch: getPepsiInStock} = useContractRead({
        address: VENDINGMACHINE_ADDRESS,
        abi: VENDINGMACHINE_ABI,
        functionName: "getPepsiInStock",
        onSuccess(data) {
            setPepsiInStock(parseInt(data._hex))
        }
    })
    const {refetch: getCocaColaInStock} = useContractRead({
        address: VENDINGMACHINE_ADDRESS,
        abi: VENDINGMACHINE_ABI,
        functionName: "getCocaColaInStock",
        onSuccess(data) {
            setCocaColaInStock(parseInt(data._hex))
            
        }
    })

    const {write: approvePurchaseCocaCola,
            isLoading: isLoadingApprovePurchaseCocaCola,
            isSuccess: isSuccessApprovePurchaseCocaCola} = useContractWrite({
        address: ZCDTOKEN_ADDRESS,
       abi: ZCDTOKEN_ABI,
       functionName: "approve",
       args: [VENDINGMACHINE_ADDRESS,"10000000000000000000" ]
        
    })
    const {write: approvePurchasePepsi, 
            isLoading: isLoadingApprovePurchasePepsi,
            isSuccess: isSuccessApprovePurchasePepsi} = useContractWrite({
        address: ZCDTOKEN_ADDRESS,
       abi: ZCDTOKEN_ABI,
       functionName: "approve",
       args: [VENDINGMACHINE_ADDRESS,"10000000000000000000" ]
        
    })
    
    const { write: purchasePepsi, 
        isLoading: isLoadingPurchasePepsi,
        isSuccess: isSuccessPurchasePepsi } = useContractWrite({
        address: VENDINGMACHINE_ADDRESS,
        abi: VENDINGMACHINE_ABI,
        functionName: "purchase",
        args: [1],
        overrides: {
            gasLimit: 80000
        }, 
        onSuccess() {
            getPepsiInStock();
        }
    })
    const { write: purchaseCocaCola,
            isLoading: isLoadingPurchaseCocaCola,
            isSuccess: isSuccessPurchaseCocaCola } = useContractWrite({
        address: VENDINGMACHINE_ADDRESS,
        abi: VENDINGMACHINE_ABI,
        functionName: "purchase",
        args: [0],
        overrides: {
            gasLimit: 80000
        },
        onSuccess() { 
            getCocaColaInStock();
        }
    })

    if (isLoadingApprovePurchasePepsi ||  isLoadingPurchasePepsi ||
          isLoadingApprovePurchaseCocaCola || isLoadingPurchaseCocaCola ||
          isLoadingChargeCocaColaInStock || isLoadingChargePepsiInStock) {
        return  (
            <div className="loading-page">
                
                 <ReactLoading type="spokes" color="rgba(81, 148, 247, 1)" 
                     className="loading"/>

            </div>
        )
    }
    return (
        <div className="Home">
            <h1> Welcome to the vending machine, pick a soda and have fun </h1>
            <div className="connect-btn">
            <Web3Button />
            </div>
            <div className="Home-inner">
            <div className="pepsi">
                <img src={imagePepsi} className="pepsi-img"/>
                {
                    isSuccessPurchasePepsi ? 
                    <p className="success-message-pepsi">
                         You have successfully bought a Pepsi, have fun
                    </p> 
                    : 
                    <p className="in-stock"> Total in stock: {PepsiInStock} </p>
                }
                
                {
                    isSuccessApprovePurchasePepsi ? 
                    <>
                    <button onClick={purchasePepsi} className="pepsi-btn">
                        purchase 
                    </button>
                    <p> [now Buy]</p>
                    </>
                    :
                    <>
                    <button onClick={approvePurchasePepsi} className="pepsi-btn">
                        approve
                    </button>
                    <p> [first approve ZCD]</p>
                    </>
                }
                
                {
                    account.address !== OWNER_ADDRESS ? "" : 
                    <button onClick={chargePepsiInStock} disabled={account.address !== OWNER_ADDRESS} className="pepsi-btn charge-btn" >
                    charge Pepsi (only Owner)
                     </button>
                }
                
            </div>

            <div className="Coca-cola" >
                <img src={imageCocaCola} className="coca-cola-img"/>
                {
                    isSuccessPurchaseCocaCola ? 
                    <p className="success-message-cola">
                        You have successfully bought a Cola, have fun
                    </p>
                    :
                    <p className="in-stock"> Total in stock = {CocaColaInStock}</p>
                }
               
                {
                    isSuccessApprovePurchaseCocaCola ?  
                    <>
                    <button onClick={purchaseCocaCola} className="coca-btn">
                      purchase 
                    </button>
                    <p> [now Buy]</p>
                    </>
                    :
                    <>
                    <button onClick={approvePurchaseCocaCola} className="coca-btn">
                      approve 
                    </button>
                    <p> [first approve ZCD]</p>
                    </>
                }
                {
                    account.address !== OWNER_ADDRESS ? "" :
                <button onClick={chargeCocaColaInStock} disabled={account.address !== OWNER_ADDRESS} className="coca-btn charge-btn">
                    charge CocaCola (only Owner)
                </button>   
                }
                
                
               
            </div>
            </div>
        {
            account.address !== OWNER_ADDRESS ? 
            <div className="footer">
            made by @zankoocode 
            <a href="twitter.com/zankoocode" target="_blank" className="twitter-logo">
                <AiFillTwitterCircle />
            </a> 
            <a href="github.com/zankoocode" target="_blank" className="github-logo">
                <AiFillGithub />
            </a>
            </div> : ""
        }
       
        </div>
    )
}

export default HomePage;