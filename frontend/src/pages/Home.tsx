import {
  Box,
  Heading,
  Container,
  Text,
  Stack,
} from "@chakra-ui/react";

export default function Home() {
  return (
    <>
      <Container maxW={"3xl"}>
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 36, md: 48 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            List your property on <br />
            <Text as={"span"} color={"green.400"}>
              EthStates
            </Text>
          </Heading>
          <Text fontSize={"larger"} color={"gray.500"}>
            Real Estate for real people.
          </Text>
        </Stack>
      </Container>
    </>
  );
}
