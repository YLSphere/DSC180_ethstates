import {
  Editable,
  EditableInput,
  EditablePreview,
  Image,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import Polygon from "./assets/polygon.svg";
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
        <Image src={Polygon} alt="logo" height={5} width={5} mr={2}/>
        {isOwner ? (
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
        ) : (
          nft.property.price.toString()
        )}
      </StatNumber>
    </Stat>
  );
}
