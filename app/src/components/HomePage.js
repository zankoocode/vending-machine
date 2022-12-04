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

    const [CocaColaInMachine, setCocaColaInMachine] = useState(0);
    const [PepsiInMachine, setPepsiInMachine] = useState(0);
    const [ZCDUserBalance, setZCDUserBalance] = useState(0);

    const account = useAccount();

    const { refetch: getZCDUserBalance} = useContractRead({
        address: ZCDTOKEN_ADDRESS,
        abi: ZCDTOKEN_ABI,
        functionName: "balanceOf",
        args: [account.address],
        onSuccess(data){
            setZCDUserBalance(parseInt(data._hex))
        }
    })
    
    const { write: chargePepsiInMachine, isLoading: isLoadingChargePepsiInMachine} = useContractWrite({
        address: VENDINGMACHINE_ADDRESS,
        abi: VENDINGMACHINE_ABI,
        functionName: "chargePepsiInMachine",
        args: [100],
        overrides: {
            gasLimit: 80000
        },
        onSuccess() {
            getPepsiInMachine();
        }
    })
    const { write: chargeCocaColaInMachine, isLoading: isLoadingChargeCocaColaInMachine} = useContractWrite({
        address: VENDINGMACHINE_ADDRESS,
        abi: VENDINGMACHINE_ABI,
        functionName: "chargeCocaColaInMachine",
        args: [100],
        overrides: {
            gasLimit: 80000
        },
        onSuccess(){
            getCocaColaInMachine();
        }
    })


    const {refetch: getPepsiInMachine} = useContractRead({
        address: VENDINGMACHINE_ADDRESS,
        abi: VENDINGMACHINE_ABI,
        functionName: "getPepsiInMachine",
        onSuccess(data) {
            setPepsiInMachine(parseInt(data._hex))
        }
    })
    const {refetch: getCocaColaInMachine} = useContractRead({
        address: VENDINGMACHINE_ADDRESS,
        abi: VENDINGMACHINE_ABI,
        functionName: "getCocaColaInMachine",
        onSuccess(data) {
            setCocaColaInMachine(parseInt(data._hex))
            
        }
    })

    const {write: approvePurchaseCocaCola,
            isLoading: isLoadingApprovePurchaseCocaCola,
            isSuccess: isSuccessApprovePurchaseCocaCola} = useContractWrite({
        address: ZCDTOKEN_ADDRESS,
       abi: ZCDTOKEN_ABI,
       functionName: "approve",
       args: [VENDINGMACHINE_ADDRESS,"1000000000000000000" ]
        
    })
    const {write: approvePurchasePepsi, 
            isLoading: isLoadingApprovePurchasePepsi,
            isSuccess: isSuccessApprovePurchasePepsi} = useContractWrite({
        address: ZCDTOKEN_ADDRESS,
       abi: ZCDTOKEN_ABI,
       functionName: "approve",
       args: [VENDINGMACHINE_ADDRESS,"1000000000000000000" ]
        
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
            getPepsiInMachine();
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
            getCocaColaInMachine();
        }
    })

    if (isLoadingApprovePurchasePepsi ||  isLoadingPurchasePepsi ||
          isLoadingApprovePurchaseCocaCola || isLoadingPurchaseCocaCola ||
          isLoadingChargeCocaColaInMachine || isLoadingChargePepsiInMachine) {
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
               
                {
                    isSuccessPurchasePepsi ? 
                    <>
                    <img src={imagePepsi} className="pepsi-img"/>
                    <p className="success-message-pepsi">
                         You have successfully bought a Pepsi, have fun
                    </p> 
                    </>
                    : 
                    <>
                     <img src={imagePepsi} className="pepsi-img"/>
                    <p className="in-stock"> Total in Machine: {PepsiInMachine} </p>
                    {
                    isSuccessApprovePurchasePepsi ? 
                    <>
                    <button onClick={purchasePepsi} className="pepsi-btn" disabled={ZCDUserBalance <= 1}> 
                        purchase 
                    </button>
                    <p> [now Buy]</p>
                    </>
                    :
                    <>
                    <button onClick={approvePurchasePepsi} className="pepsi-btn" disabled={ZCDUserBalance <= 1}>
                        approve
                    </button>
                    {
                        ZCDUserBalance <= 1 ? 
                        <p> [You dont own any ZCD]</p> 
                        :
                        <p> [first approve ZCD]</p>
                    }
                    
                    </>
                }
                    </>
                }
                
                
                
                {
                    account.address !== OWNER_ADDRESS ? "" : 
                    <button onClick={chargePepsiInMachine} disabled={account.address !== OWNER_ADDRESS} className="pepsi-btn charge-btn" >
                    charge Pepsi (only Owner)
                     </button>
                }
                
            </div>

            <div className="Coca-cola" >
                
                {
                    isSuccessPurchaseCocaCola ?
                    <>
                    <img src={imageCocaCola} className="coca-cola-img"/>
                    <p className="success-message-cola">
                        You have successfully bought a Cola, have fun
                    </p>
                    </>
                    :
                    <>
                    <img src={imageCocaCola} className="coca-cola-img"/>
                    <p className="in-stock"> Total in Machine = {CocaColaInMachine}</p>
                    {
                    isSuccessApprovePurchaseCocaCola ?  
                    <>
                    <button onClick={purchaseCocaCola} className="coca-btn" disabled={ZCDUserBalance <= 1}>
                      purchase 
                    </button>
                    <p> [now Buy]</p>
                    </>
                    :
                    <>
                    <button onClick={approvePurchaseCocaCola} className="coca-btn" disabled={ZCDUserBalance <= 1}>
                      approve 
                    </button>
                    {
                        ZCDUserBalance <= 1 ? 
                        <p> [You dont own any ZCD]</p> 
                        :
                        <p> [first approve ZCD]</p>
                    }
                    
                    </>
                }
                    </>
                }
               
                
                {
                    account.address !== OWNER_ADDRESS ? "" :
                <button onClick={chargeCocaColaInMachine} disabled={account.address !== OWNER_ADDRESS} className="coca-btn charge-btn">
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
