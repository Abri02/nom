import "./App.css";
import { Login } from "./features/auth/Login";
import { NomButtons } from "./features/common/components/NomButton";
import { Flex } from "@chakra-ui/react";

function App() {
  return (
    <>
      <Flex>
        <Login/>
      </Flex>
    </>
  );
}

export default App;
