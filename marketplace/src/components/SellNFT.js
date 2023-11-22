import Navbar from "./Navbar";
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import Marketplace from '../Marketplace.json';
import { useLocation } from "react-router";

export default function SellNFT () {
    const [formParams, updateFormParams] = useState({squareFootage: '', bedrooms: '', bathrooms: '', parking: '', additionalFeatures: '', street: '', city: '', state: '', zipCode: '', contactDetails: '', price: ''});
    const [fileURL, setFileURL] = useState(null);
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');
    const location = useLocation();

    async function disableButton() {
        const listButton = document.getElementById("list-button")
        listButton.disabled = true
        listButton.style.backgroundColor = "grey";
        listButton.style.opacity = 0.3;
    }

    async function enableButton() {
        const listButton = document.getElementById("list-button")
        listButton.disabled = false
        listButton.style.backgroundColor = "#A500FF";
        listButton.style.opacity = 1;
    }

    //This function uploads the NFT image to IPFS
    async function OnChangeFile(e) {
        var file = e.target.files[0];
        //check for file extension
        try {
            //upload the file to IPFS
            disableButton();
            updateMessage("Uploading image.. please dont click anything!")
            const response = await uploadFileToIPFS(file);
            if(response.success === true) {
                enableButton();
                updateMessage("")
                console.log("Uploaded image to Pinata: ", response.pinataURL)
                setFileURL(response.pinataURL);
            }
        }
        catch(e) {
            console.log("Error during file upload", e);
        }
    }
  
    //This function uploads the metadata to IPFS
    async function uploadMetadataToIPFS() {
        const {squareFootage, bedrooms, bathrooms, parking, additionalFeatures, street, city, state, zipCode, contactDetails, price} = formParams;
        //Make sure that none of the fields are empty
        if( !squareFootage || !bedrooms || !fileURL|| !bathrooms|| !parking|| !additionalFeatures|| !street|| !city|| !state|| !zipCode|| !contactDetails|| !price)
        {
            updateMessage("Please fill all the fields!")
            return -1;
        }

        const nftJSON = {
            squareFootage, bedrooms, bathrooms, parking, additionalFeatures, street, city, state, zipCode, contactDetails, price, image: fileURL
        }

        try {
            //upload the metadata JSON to IPFS
            const response = await uploadJSONToIPFS(nftJSON);
            if(response.success === true){
                console.log("Uploaded JSON to Pinata: ", response)
                return response.pinataURL;
            }
        }
        catch(e) {
            console.log("error uploading JSON metadata:", e)
        }
    }

    async function listNFT(e) {
        e.preventDefault();

        //Upload data to IPFS
        try {
            const metadataURL = await uploadMetadataToIPFS();
            if(metadataURL === -1)
                return;
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            disableButton();
            updateMessage("Uploading NFT(takes 5 mins).. please dont click anything!")

            //Pull the deployed contract instance
            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)

            //massage the params to be sent to the create NFT request
            const price = ethers.utils.parseUnits(formParams.price, 'ether')
            let listingPrice = await contract.getListPrice()
            listingPrice = listingPrice.toString()

            //actually create the NFT
            let transaction = await contract.createToken(metadataURL, price, { value: listingPrice })
            await transaction.wait()

            alert("Successfully listed your NFT!");
            enableButton();
            updateMessage("");
            updateFormParams({squareFootage: '', bedrooms: '', bathrooms: '', parking: '', additionalFeatures: '', street: '', city: '', state: '', zipCode: '', contactDetails: '', price: ''});
            window.location.replace("/")
        }
        catch(e) {
            alert( "Upload error"+e )
        }
    }

    console.log("Working", process.env);
    return (
        <div className="">
        <Navbar></Navbar>
        <div className=" flex flex-col place-items-center mt-10" id="nftForm">
            <form className="bg-white shadow-md rounded px-10 pt-4 pb-20 mb-4">
            <h3 className="text-center font-bold text-black-500 mb-8">Upload your property to the marketplace</h3>
                <div className="mb-4">
                    <label className="block text-black-500 text-sm font-bold mb-2" htmlFor="name">Street Name</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="1111 El Camino Drive" onChange={e => updateFormParams({...formParams, street: e.target.value})} value={formParams.street}></input>
                </div>
                <div className="mb-4">
                    <label className="block text-black-500 text-sm font-bold mb-2" htmlFor="name">City</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="San Diego" onChange={e => updateFormParams({...formParams, city: e.target.value})} value={formParams.city}></input>
                </div>
                <div className="mb-4">
                    <label className="block text-black-500 text-sm font-bold mb-2" htmlFor="name">State</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="CA" onChange={e => updateFormParams({...formParams, state: e.target.value})} value={formParams.state}></input>
                </div>
                <div className="mb-4">
                    <label className="block text-black-500 text-sm font-bold mb-2" htmlFor="name">Zipcode</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="11111" onChange={e => updateFormParams({...formParams, zipCode: e.target.value})} value={formParams.zipCode}></input>
                </div>

                <div className="mb-4">
                    <label className="block text-black-500 text-sm font-bold mb-2" htmlFor="name">Square Footage</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="960" onChange={e => updateFormParams({...formParams, squareFootage: e.target.value})} value={formParams.squareFootage}></input>
                </div>
                <div className="mb-4">
                    <label className="block text-black-500 text-sm font-bold mb-2" htmlFor="name">Bedrooms</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="2" onChange={e => updateFormParams({...formParams, bedrooms: e.target.value})} value={formParams.bedrooms}></input>
                </div>
                <div className="mb-4">
                    <label className="block text-black-500 text-sm font-bold mb-2" htmlFor="name">Bathrooms</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="2" onChange={e => updateFormParams({...formParams, bathrooms: e.target.value})} value={formParams.bathrooms}></input>
                </div>
                <div className="mb-4">
                    <label className="block text-black-500 text-sm font-bold mb-2" htmlFor="name">Parking Spaces</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="1" onChange={e => updateFormParams({...formParams, parking: e.target.value})} value={formParams.parking}></input>
                </div>

                <div className="mb-4">
                    <label className="block text-black-500 text-sm font-bold mb-2" htmlFor="name">Contact email</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="example@gmail.com" onChange={e => updateFormParams({...formParams, contactDetails: e.target.value})} value={formParams.contactDetails}></input>
                </div>

                <div className="mb-6">
                    <label className="block text-black-500 text-sm font-bold mb-2" htmlFor="description">Additional Features</label>
                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" cols="40" rows="5" id="description" type="text" placeholder="Property Description" value={formParams.additionalFeatures} onChange={e => updateFormParams({...formParams, additionalFeatures: e.target.value})}></textarea>
                </div>
                <div className="mb-6">
                    <label className="block text-black-500 text-sm font-bold mb-2" htmlFor="price">Price (in ETH)</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Min 0.01 ETH" step="0.01" value={formParams.price} onChange={e => updateFormParams({...formParams, price: e.target.value})}></input>
                </div>
                <div>
                    <label className="block text-black-500 text-sm font-bold mb-2" htmlFor="image">Upload Image (&lt;500 KB)</label>
                    <input type={"file"} onChange={OnChangeFile}></input>
                </div>
                <br></br>
                <div className="text-red-500 text-center">{message}</div>
                <button onClick={listNFT} className="font-bold mt-10 w-full bg-blue-500 text-white rounded p-2 shadow-lg" id="list-button">
                    List Property!
                </button>
            </form>
        </div>
        </div>
    )
}