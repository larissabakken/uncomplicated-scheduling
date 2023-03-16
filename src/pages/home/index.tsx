import { Heading, Text } from "@ignite-ui/react";
import Image from "next/image";
import { Container, Hero, Preview } from "./styles";

import previewImage from "../../assets/app-preview.png";
import { ClaimUsernameForm } from "./components/ClaimUsernameForm";

/**
 * Renders the home page with a hero section and a preview section.
 */
export default function Home() {
  return (
    <>
      <Container>
        <Hero>
          <Heading as="h1" size="4xl">
            Easy scheduling
          </Heading>
          <Text size="xl">
            Connect your calendar and allow people to schedule appointments
            during your available time.
          </Text>

          <ClaimUsernameForm />
        </Hero>

        <Preview>
          <Image
            src={previewImage}
            height={400}
            quality={100}
            priority
            alt="Calendar symbolizing application in operation"
          />
        </Preview>
      </Container>
    </>
  );
}
