import {
  Editable,
  EditableInput,
  EditablePreview,
  Stat,
  StatLabel,
  StatNumber,
  Tooltip,
  HStack,
} from "@chakra-ui/react";
import { FaEthereum } from "react-icons/fa";
import { VscInfo } from "react-icons/vsc";
import { Nft } from "../../types/listing";
import { useSetPrice } from "../../hooks/marketplace/useProperty";
import { useEffect, useState } from "react";

interface Props {
  nft: Nft;
  address: `0x${string}`;
}

export default function PropertyPrice({
  nft,
  address,
}: Props) {
  const updatePrice = useSetPrice();
  const [price, setPrice] = useState(nft.property.price.toString());
  const isOwner = nft.owner === address;

  useEffect(() => {
    if (updatePrice.status === "error") {
      setPrice(nft.property.price.toString());
    }
  }, [updatePrice.status]);

  return (
    <Stat>
      <StatLabel>Property Price</StatLabel>
      <StatNumber display={"flex"} flexDirection={"row"} alignItems={"center"}>
        <FaEthereum size={20} />
        {isOwner ? (
          <HStack>
            <Editable
              defaultValue={nft.property.price.toString()}
              value={price.toString()}
              onChange={(e) => setPrice(e)}
              onSubmit={() => {
                if (parseFloat(price) === nft.property.price) return;
                updatePrice.mutate({
                  address,
                  id: nft.property.propertyId,
                  price: parseFloat(price),
                });
              }}
            >
              <EditablePreview />
              <EditableInput />
            </Editable>
            <Tooltip label = 'Click on the price to adjust it' placement='right'>
              <span><VscInfo size = '20' /></span>
            </Tooltip>
          </HStack>
        ) : (
          nft.property.price.toString()
        )}
      </StatNumber>
    </Stat>
  );
}
