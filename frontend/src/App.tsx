import "./App.css";
import { NomButtons } from "./features/common/components/NomButton";
import { Flex } from "@chakra-ui/react";

function App() {
  return (
    <>
      <Flex>
        <NomButtons onClick={() => {}} title="Nom" variant="outline" />
      </Flex>
    </>
  );
}

export default App;
