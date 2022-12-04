// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IZCDToken {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
} 

// Venidng Machine contract 
contract VendingMachine is Context, Ownable{

    IZCDToken zcdToken;

    constructor (IZCDToken zcdTokenAddress) {
        zcdToken = zcdTokenAddress;
    }

    enum Soda {
        CocaCola,
        Pepsi
    }

    uint256 private CocaColaInMachine;

    uint256 private PepsiInMachine;

    function getCocaColaInMachine () public view returns (uint256) {
        return CocaColaInMachine;
    }
    function getPepsiInMachine () public view returns (uint256) {
        return PepsiInMachine;
    }

    function chargeCocaColaInMachine (uint256 amount) external onlyOwner{
        unchecked {
            CocaColaInMachine += amount;
        }
    }
    function chargePepsiInMachine (uint256 amount) external onlyOwner {
        unchecked {
            PepsiInMachine += amount;
        }
    }

    function purchase (Soda soda) external returns (bool) {
        
        (bool sent) = zcdToken.transferFrom(_msgSender() ,payable(address(this)), 1e18);
        require(sent == true, "you should pay the money");

        if (soda == Soda.CocaCola) {
            require(CocaColaInMachine >= 1, "vending machine doesnt have enough CocaCola");
            unchecked {
                CocaColaInMachine -= 1;
            }
            
        } else if (soda == Soda.Pepsi) {
            require(PepsiInMachine >= 1, "vending machine doesnt have enough Pepsi");
            unchecked {
                PepsiInMachine -= 1;
            }
           
        }
         return true;
    }
}