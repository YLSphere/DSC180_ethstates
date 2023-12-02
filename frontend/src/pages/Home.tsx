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
          <Text color={"gray.500"}>
            Monetize your content by charging your most loyal readers and reward
            them loyalty points. Give back to your loyal readers by granting
            them access to your pre-releases and sneak-peaks.
          </Text>
        </Stack>
      </Container>
    </>
  );
}
