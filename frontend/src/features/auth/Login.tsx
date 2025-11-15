import { Button, Field, Input, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { NomButtons } from "../common/components/NomButton";

type LoginFormInputs = {
  email: string;
  password: string;
};

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = handleSubmit((data: LoginFormInputs) => {
    const stored = localStorage.getItem(data.email);
    const userData = stored
      ? (JSON.parse(stored) as { name?: string; password?: string })
      : null;
    if (userData) {
      if (userData.password === data.password) {
        console.log(userData.name + " You Are Successfully Logged In");
      } else {
        console.log("Email or Password is not matching with our record");
      }
    } else {
      console.log("Email or Password is not matching with our record");
    }
  });

  return (
    <form className="Login" onSubmit={onSubmit}>
      <Stack gap={3} align="flex-start" maxW="sm">
        <Field.Root invalid={!!errors.email}>
          <Field.Label>Email</Field.Label>
          <Input
            {...register("email", { required: true })}
            type="email"
            placeholder="Email"
          />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={!!errors.password}>
          <Field.Label>Password</Field.Label>
          <Input
            {...register("password", { required: true })}
            type="password"
            placeholder="Password"
          />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        <Button title="Sumbit" onClick={() => {}} variant="ghost">
          Submit
        </Button>
      </Stack>
    </form>
  );
}
