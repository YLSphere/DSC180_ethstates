import { Container } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export default function PropertyItem() {
  const { id } = useParams();

  return (
    <main>
      <Container>
        <h1>Hello, Property Item {id} Page!</h1>
      </Container>
    </main>
  );
}
