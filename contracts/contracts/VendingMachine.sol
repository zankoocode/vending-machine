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

    uint256 private CocaColaInStock;

    uint256 private PepsiInStock;

    function getCocaColaInStock () public view returns (uint256) {
        return CocaColaInStock;
    }
    function getPepsiInStock () public view returns (uint256) {
        return PepsiInStock;
    }

    function chargeCocaColaInStock (uint256 amount) external onlyOwner{
        unchecked {
            CocaColaInStock += amount;
        }
    }
    function chargePepsiInStock (uint256 amount) external onlyOwner {
        unchecked {
            PepsiInStock += amount;
        }
    }

    function purchase (Soda soda) external returns (bool) {
        
        (bool sent) = zcdToken.transferFrom(_msgSender() ,payable(address(this)), 1e18);
        require(sent == true, "you should pay the money");

        if (soda == Soda.CocaCola) {
            require(CocaColaInStock >= 1, "vending machine doesnt have enough CocaCola");
            unchecked {
                CocaColaInStock -= 1;
            }
            
        } else if (soda == Soda.Pepsi) {
            require(PepsiInStock >= 1, "vending machine doesnt have enough Pepsi");
            unchecked {
                PepsiInStock -= 1;
            }
           
        }
         return true;
    }
}