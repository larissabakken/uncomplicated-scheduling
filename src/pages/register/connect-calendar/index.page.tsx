import { Button, Heading, MultiStep, Text } from "@ignite-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ArrowRight, Check } from "phosphor-react";
import { Container, Header } from "../styles";
import { AuthError, ConnectBox, ConnectItem } from "./styles";

/**
 * Component that allows the user to connect their calendar
 * and move to the next step in the registration process.
 * @returns JSX.Element
 */
export default function ConnectCalendar() {
  const session = useSession();
  const router = useRouter();

  const hasAuthError = !!router.query.error;
  const isSignedId = session.status === "authenticated";

  /**
   * Function that handles the connection of the Google Calendar account.
   * @returns Promise<void>
   */
  async function handleConnectCalendar() {
    await signIn("google");
  }

  /**
   * Function that navigates to the next step in the registration process.
   * @returns Promise<void>
   */
  async function handleNavigateToNextStep() {
    await router.push("/register/time-intervals");
  }

  return (
    <>
      <Container>
        <Header>
          <Heading as="strong">Connect your calendar!</Heading>
          <Text>
            Connect your calendar to automatically check busy times and new
            events as they are scheduled.
          </Text>

          <MultiStep size={4} currentStep={2} />
        </Header>

        <ConnectBox>
          <ConnectItem>
            <Text>Google Calendar</Text>
            {isSignedId ? (
              <Button size="sm" disabled>
                Connected.
                <Check />
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleConnectCalendar}
              >
                Connect
                <ArrowRight />
              </Button>
            )}
          </ConnectItem>

          {hasAuthError && (
            <AuthError size="sm">
              Failed to connect to Google, please check if you have enabled
              Google Calendar access permissions.
            </AuthError>
          )}

          <Button
            onClick={handleNavigateToNextStep}
            type="submit"
            disabled={!isSignedId}
          >
            Next step
            <ArrowRight />
          </Button>
        </ConnectBox>
      </Container>
    </>
  );
}
