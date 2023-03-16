import { Button, Text, TextInput } from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormAnnotation } from "./styles";
import { useRouter } from "next/router";

/**
 * Schema for the form data to claim a username.
 * @typedef {object} ClaimUsernameFormData
 * @property {string} username - The desired username.
 */
const ClaimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "The username must have at least 3 letters." })
    .regex(/^([a-z\\-]+)$/i, {
      message: "The username can only have letters and hyphens.",
    })
    .transform((username) => username.toLowerCase()),
});

type ClaimUsernameFormData = z.infer<typeof ClaimUsernameFormSchema>;

/**
 * Renders a form to claim a username.
 * @returns {JSX.Element} The component's UI.
 */
export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(ClaimUsernameFormSchema),
  });

  const router = useRouter();

  /**
   * Handles the form submission to claim a username.
   * @param {ClaimUsernameFormData} data - The form data.
   * @returns {Promise<void>} A Promise that resolves when the operation completes.
   */
  async function handleClaimUsername(data: ClaimUsernameFormData) {
    const { username } = data;

    router.push(`/register?username=${username}`);
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="calendar.com/"
          placeholder="username"
          {...register("username")}
        />
        <Button size="sm" type="submit" disabled={isSubmitting}>
          Reservar
          <ArrowRight />
        </Button>
      </Form>

      <FormAnnotation>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : "Enter the desired username."}
        </Text>
      </FormAnnotation>
    </>
  );
}
