import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { ArrowRight } from "phosphor-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../lib/axios";

import { Container, Form, FormError, Header } from "./styles";

/**
 * Zod schema for user registration form validation
 * @type {z.ZodObject}
 */
const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "The username must have at least 3 letters." })
    .regex(/^([a-z\\-]+)$/i, {
      message: "The username can only have letters and hyphens.",
    })
    .transform((username) => username.toLowerCase()),
  name: z
    .string()
    .min(3, { message: "The name needs to have at least 3 letters." }),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

/**
 * useForm hook used to manage form state and submission
 * @typedef {Object} useForm
 * @property {Function} register - Register an input with the form
 * @property {Function} handleSubmit - Handle the form submission
 * @property {Function} setValue - Set the value of an input in the form
 * @property {Object} formState - Object containing form state properties
 * @property {Object} formState.errors - Object containing form errors
 * @property {boolean} formState.isSubmitting - Boolean indicating if the form is submitting
 * @typedef {Object} RegisterFormData - Object containing register form data
 * @typedef {Object} zodResolver - Object containing schema for validating register form data
 * @return {JSX.Element}
 */
export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  const router = useRouter();

  useEffect(() => {
    // Set the initial value for the username input field based on the query
    if (router.query.username) {
      setValue("username", String(router.query.username));
    }
  }, [router.query?.username, setValue]);

  async function handleRegister(data: RegisterFormData) {
    try {
      // Call the API to create a new user with the submitted data
      await api.post("/users", {
        name: data.name,
        username: data.username,
      });

      // Redirect to the next step in the registration process
      await router.push("/register/connect-calendar");
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message) {
        alert(err.response.data.message);
        return;
      }

      console.error(err);
    }
  }

  return (
    <>
      <Container>
        <Header>
          <Heading as="strong">Uncomplicated Scheduling!</Heading>
          <Text>
            We need some information to create your profile! Oh, you can edit
            this information later.
          </Text>

          <MultiStep size={4} currentStep={1} />
        </Header>

        <Form as="form" onSubmit={handleSubmit(handleRegister)}>
          <label>
            <Text size="sm">Username</Text>
            <TextInput
              prefix="calendar.com/"
              placeholder="username"
              {...register("username")}
            />

            {errors.username && (
              <FormError size="sm">{errors.username.message}</FormError>
            )}
          </label>

          <label>
            <Text size="sm">Full Name</Text>
            <TextInput placeholder="Your Name" {...register("name")} />

            {errors.name && (
              <FormError size="sm">{errors.name.message}</FormError>
            )}
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Next Step
            <ArrowRight />
          </Button>
        </Form>
      </Container>
    </>
  );
}
