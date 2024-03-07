import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Container,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main>
      <Container
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
        maxWidth="container.sm"
      >
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
        >
          <AlertIcon boxSize={10} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Page not found
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            Please navigate back to the <Link to="/">marketplace</Link>.
          </AlertDescription>
        </Alert>
      </Container>
    </main>
  );
}
