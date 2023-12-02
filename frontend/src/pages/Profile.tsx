import { Container, Heading } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState, useEffect, useRef } from "react";
import { Network, Alchemy, OwnedNftsResponse, Nft } from "alchemy-sdk";
import { useAccount, useChainId } from "wagmi";
import { mainnet, goerli, sepolia } from "wagmi/chains";

// import { initializeDapp } from "../services/Dapp";

import NftCard from "../components/NftCard";
import NftCollection from "../components/NftCollection";

const propertyCount = 4;

const chainIdToAlchemyNetwork: { [key: number]: Network } = {
  [mainnet.id]: Network.ETH_MAINNET,
  [goerli.id]: Network.ETH_GOERLI,
  [sepolia.id]: Network.ETH_SEPOLIA,
};

export default function Profile() {
  const [results, setResults] = useState<OwnedNftsResponse>();
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState<Nft[]>();
  const [dapp, setDapp] = useState<ethers.Contract>();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const alchemy = new Alchemy({
    network: chainIdToAlchemyNetwork[chainId] || Network.ETH_MAINNET,
    apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
  });

  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (isConnected) {
      // (async () => await initializeDapp(address))().then((res) => {
      //   setDapp(res);
      // });
      getNFTsForOwner();
    }
  }, [isConnected]);

  async function getNFTsForOwner() {
    if (!ethers.isAddress(address)) {
      return;
    }

    const data = await alchemy.nft.getNftsForOwner(address);
    setResults(data);

    const tokenDataPromises = [];

    for (let i = 0; i < data.ownedNfts.length; i++) {
      const tokenData = alchemy.nft.getNftMetadata(
        data.ownedNfts[i].contract.address,
        data.ownedNfts[i].tokenId
      );
      tokenDataPromises.push(tokenData);
    }

    setTokenDataObjects(await Promise.all(tokenDataPromises));
    setHasQueried(true);
  }

  return (
    <main>
      <Container maxWidth="container.lg">
        {/* {hasQueried ? (
          <div>
            {results.ownedNfts.map((e, i) => {
              console.log(e, i);
              return (
                <div key={e.tokenId}>
                  <Box>
                    <b>Name:</b>{" "}
                    {tokenDataObjects[i].name?.length === 0
                      ? "No Name"
                      : tokenDataObjects[i].name}
                  </Box>
                  <img
                    src={
                      tokenDataObjects[i]?.raw?.metadata?.image ??
                      "https://via.placeholder.com/200"
                    }
                    alt={"Image"}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          "Please make a query! The query may take a few seconds..."
        )} */}

        <Heading as="h1" size="xl" mt={8}>
          NFT Collection
        </Heading>

        <NftCollection>
          {Array(propertyCount)
            .fill("")
            .map((_, i) => (
              <NftCard key={i} />
            ))}
        </NftCollection>
      </Container>
    </main>
  );
}
