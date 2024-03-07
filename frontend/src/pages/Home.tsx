import {
  Box,
  Heading,
  Container,
  Text,
  Stack,
} from "@chakra-ui/react";
import "../../../fonts/IBMPlexSansCondensed-Regular.ttf";
import "../../../fonts/IBMPlexSans-Regular.ttf";
import "../../../fonts/JosefinSans-Regular.ttf";
import "../App.css";

export default function Home() {
  return (
    <Box>
      <Stack
        as={Box}
        textAlign={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 36, md: 48 }}
      >
        <Heading
          fontFamily="Josefin Sans"
          fontWeight={600}
          fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
          
        >
          List your property on <br />
          <Text as={"span"} color={"green.400"}>
            EthStates
          </Text>
        </Heading>
        <Text color={"gray.800"} fontFamily = "Josefin Sans" fontSize = "md" fontWeight={400}>
          Real Estate for real people.
        </Text>
      </Stack>
    </Box>
  );
}

