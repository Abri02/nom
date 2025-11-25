import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuthContext";
import { RegisterTypeSelection } from "./RegisterTypeSelection";

export function Register() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  if (isLoggedIn) navigate("/home");
  return <RegisterTypeSelection />;
}
