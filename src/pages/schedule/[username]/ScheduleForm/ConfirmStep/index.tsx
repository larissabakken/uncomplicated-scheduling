import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Text, TextArea, TextInput } from "@ignite-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { CalendarBlank, Clock } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../../../lib/axios";
import { ConfirmForm, FormActions, FormError, FormHeader } from "./styles";

// Define validation schema with Zod
const confirmFormSchema = z.object({
  name: z.string().min(3, { message: "O nome precisa no mínimo 3 caracteres" }),
  email: z.string().email({ message: "Digite um e-mail válido" }),
  observations: z.string().nullable(),
});

// Infer form data type from schema
type ConfirmFormData = z.infer<typeof confirmFormSchema>;

// Define props for ConfirmStep component
interface ConfirmStepProps {
  schedulingDate: Date;
  onCancelConfirmation: () => void;
}

/**
 * Displays the confirmation form for scheduling an appointment and handles form submission.
 * @param {ConfirmStepProps} props - The component props.
 * @param {Date} props.schedulingDate - The selected scheduling date.
 * @param {Function} props.onCancelConfirmation - The function to cancel the scheduling confirmation.
 * @returns {JSX.Element} - The ConfirmStep component.
 */
export function ConfirmStep({
  schedulingDate,
  onCancelConfirmation,
}: ConfirmStepProps) {
  // Use react-hook-form to handle form state and validation
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema),
  });

  // Use next/router to get the username from the URL query parameter
  const router = useRouter();
  const username = String(router.query.username);

  /**
   * Handles the form submission by sending the scheduling data to the API and calling the onCancelConfirmation function.
   * @param {ConfirmFormData} data - The form data.
   * @returns {Promise<void>} - A Promise that resolves when the scheduling data is sent to the API.
   */
  async function handleConfirmScheduling(data: ConfirmFormData) {
    const { name, email, observations } = data;

    // Send scheduling data to the API
    await api.post(`/users/${username}/schedule`, {
      name,
      email,
      observations,
      date: schedulingDate,
    });

    onCancelConfirmation();
  }

  // Format schedulingDate for display
  const describedDate = dayjs(schedulingDate).format("DD[ de ]MMMM[ de ]YYYY");
  const describedTime = dayjs(schedulingDate).format("HH:mm[h]");

  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <FormHeader>
        <Text>
          <CalendarBlank />
          {describedDate}
        </Text>
        <Text>
          <Clock />
          {describedTime}
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Full Name</Text>
        <TextInput placeholder="Your Name" {...register("name")} />
        {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
      </label>

      <label>
        <Text size="sm">Email Adress</Text>
        <TextInput
          type="email"
          placeholder="johndoe@example.com"
          {...register("email")}
        />
        {errors.email && (
          <FormError size="sm">{errors.email.message}</FormError>
        )}
      </label>

      <label>
        <Text size="sm">Observations</Text>
        <TextArea {...register("observations")} />
      </label>

      <FormActions>
        <Button type="button" variant="tertiary" onClick={onCancelConfirmation}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirm
        </Button>
      </FormActions>
    </ConfirmForm>
  );
}
