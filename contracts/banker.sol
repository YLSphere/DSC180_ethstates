// // SPDX-License-Identifier: MIT
// pragma solidity >= 0.8.19;
// contract EtherReceiver {

//     fallback () external payable {}
// }



    


// contract MyLandContract
// {
//     struct Land 
//     {
//         address Address;
//         string location;
//         uint cost;
//         uint landID;
//         uint wantSell;
//         uint interest;
//         uint paymentinterval;
//     }
    
//     address public owner;   // government who creates the contract
//     bool _switch = false;

//     uint public totalLandsCounter; //total no of lands via this contract at any time
    
//     string[] myArray;
    
//     //define who is owner
//     function MyLandContract() public
//     {
//         owner = msg.sender;
//         totalLandsCounter = 0;
//     }
    
//     //land addition event
//     event Add(address _owner, uint _landID);
//     event UpdateStatus(string _msg,uint _cost);

//     //land transfer event
//     event Transfer(address indexed _from, address indexed _to, uint _landID);
//     // land Ether Transfer
//     event EtherTransfer(address indexed _from, address indexed _to, uint _cost);
    
//     modifier isOwner
//     {
//         require(msg.sender == owner);
//         _;
//     }
    
//     //one account can hold many lands (many landTokens, each token one land)
//     mapping (address => Land[]) public __ownedLands;
//     mapping (address => uint) balance;
//     //properties to be sold
    

//     //1. FIRST OPERATION
//     //owner shall add lands via this function
//     function addLand(address propertyOwner,string _location, uint _cost) public isOwner
//     {
//         totalLandsCounter = totalLandsCounter + 1;
//         Land memory myLand = Land(
//             {
//                 ownerAddress: propertyOwner,
//                 location: _location,
//                 cost: _cost,
//                 landID: totalLandsCounter,
//                 wantSell: 1
                
//             });
//         __ownedLands[msg.sender].push(myLand);
//         Add(msg.sender, totalLandsCounter);

//     }
//     //////////////////////
//     EtherReceiver private receiverAdr = new EtherReceiver();

//     // function sendEther(uint _amount) public payable {
//     //     if (!address(receiverAdr).send(_amount)) {
//     //         //handle failed send
//     //     }
//     // }

//     // function callValueEther(uint _amount) public payable {
//     //     require(address(receiverAdr).call.value(_amount).gas(35000)());
//     // }

//     function transferEther(address rec,uint _amount) public payable {
//         address(rec).transfer(_amount);
//     }
    
//     //2. SECOND OP\\ERATION
//     //caller (owner/anyone) to transfer land to buyer provided caller is owner of the land
//     function transferLand(address _landBuyer, uint _landID) payable public returns (bool)
//     {
//         //find out the particular land ID in owner's collectionexter
//         for(uint i=0; i < (__ownedLands[msg.sender].length);i++)    
//         {
//             //if given land ID is indeed in owner's collection
//             if (__ownedLands[msg.sender][i].landID == _landID)
//             {
                
//                     // msg.sender.transfer(__ownedLands[msg.sender][i].cost);
//                     // transferEther(landBuyer,_ownedLands[msg.sender][i].cost);
//                     //UpdateStatus("dcndc",__ownedLands[msg.sender][i].cost);
//                     //balance[msg.sender]+=__ownedLands[msg.sender][i].cost;
//                     //balance[landBuyer]-=_ownedLands[msg.sender][i].cost;
//                     //copy land in new owner's collection
//                     Land memory myLand = Land(
//                     {
//                         ownerAddress:_landBuyer,
//                         location: __ownedLands[msg.sender][i].location,
//                         cost: __ownedLands[msg.sender][i].cost,
//                         landID: _landID,
//                         wantSell: __ownedLands[msg.sender][i].wantSell
//                     });
//                 __ownedLands[_landBuyer].push(myLand);   
            
                
                
//                 // EtherTransfer(msg.sender,landBuyer,_ownedLands[msg.sender][i].cost);
//                 //remove land from current ownerAddress
//                 delete __ownedLands[msg.sender][i];

                
//                 //inform the world
//                 Transfer(msg.sender, _landBuyer, _landID);                
                
//                 return true;
//             }
//         }
        
//         //if we still did not return, return false
//         return false;
//     }
    
    
    
//     // 2. TRANSFER ETHER
    
//     // function Execution (address _seller, ) {
//     //     seller.send(price);
//     // }
    
    
//     //3. THIRD OPERATION
//     //get land details of an account
//     function getLand(address _landHolder, uint _index) public returns (string, uint, address,uint, uint)
//     {
//         return (__ownedLands[_landHolder][_index].location, 
//                 __ownedLands[_landHolder][_index].cost,
//                 __ownedLands[_landHolder][_index].ownerAddress,
//                 __ownedLands[_landHolder][_index].landID,
//                 __ownedLands[_landHolder][_index].wantSell
//                 );
                
//     }
    
//     function withdraw() public {
//         msg.sender.transfer(address(this).balance);
//     }
    
//     // // GET LAND FOR SALE
//     // function getSaleLand(address _landHolder) public returns ( string[]) 
//     // {
//     //     uint indexer;
//     //     uint arrIndex=0;
        
//     //      for(indexer=0; indexer < (__ownedLands[_landHolder].length);indexer++){
//     //          if ( __ownedLands[_landHolder][indexer].wantSell == 1 ){
//     //             myArray[arrIndex]= string(abi.encodePacked(_landHolder,"!",indexer));
//     //             arrIndex++;
//     //          }
//     //      }
         
//     //      return myArray[--myArray];
        
//     // }
    
//     // REMOVE LAND FROM SALE
    
//     function RemoveFromSale(address _landHolder, uint land_id) public returns (string){
        
//         uint indexer;
        
//         for(indexer=0; indexer < (__ownedLands[_landHolder].length);indexer++){
//              if ( __ownedLands[_landHolder][indexer].landID == land_id ){
//                  if ( __ownedLands[_landHolder][indexer].wantSell == 1 ){
//                      __ownedLands[_landHolder][indexer].wantSell=0;
//                      return "OPERATION SUCCESSFULL";
//                  }else{
//                      return "PROPERTY ALREADY NOT FOR SALE";
//                  }
//              }
//          }
        
//         return "INVALID LAND ID";
//     }
    
//     //4. GET TOTAL NO OF LANDS OWNED BY AN ACCOUNT AS NO WAY TO RETURN STRUCT ARRAYS
//     function getNoOfLands(address _landHolder) public returns (uint)
//     {
//         return __ownedLands[_landHolder].length;
//     }


// }