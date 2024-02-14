import { SimpleGrid } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
}

export default function NftCollection(props: Props) {
  const { children } = props;

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5} my={5}>
      {children}
    </SimpleGrid>
  );
}
