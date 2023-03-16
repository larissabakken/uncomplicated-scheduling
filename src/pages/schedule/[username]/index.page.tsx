import { Avatar, Heading, Text } from "@ignite-ui/react";
import { GetStaticPaths, GetStaticProps } from "next";
import { prisma } from "../../../lib/prisma";
import { ScheduleForm } from "./ScheduleForm";
import { Container, UserHeader } from "./styles";

interface ScheduleProps {
  user: {
    name: string;
    bio: string;
    avatarUrl: string;
  };
}

/**
 * A component that displays the user's schedule, including a header with the user's name, avatar, and bio, and a form to schedule appointments.
 * @param {string} props.user.avatarUrl - The URL of the user's avatar.
 * @param {string} props.user.name - The name of the user.
 * @param {string} props.user.bio - The user's bio.
 * @returns {JSX.Element} - A JSX Element representing the Schedule component.
 */
export default function Schedule({ user }: ScheduleProps) {
  return (
    <>
      <Container>
        <UserHeader>
          <Avatar src={user.avatarUrl} />
          <Heading>{user.name}</Heading>
          <Text>{user.bio}</Text>
        </UserHeader>

        <ScheduleForm />
      </Container>
    </>
  );
}

/**
 * Generates the static paths for this page during build time.
 * @returns {Promise<Object>} An object with the following keys:
 *  - paths: an array of strings representing the paths to be pre-rendered
 *  - fallback: a string representing the fallback behavior to use during static generation
 */
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

/**
 * Gets the static props for the page.
 * @param {object} params - The parameters of the page.
 * @param {string} params.username - The username of the user to fetch.
 * @returns {Promise<object>} The static props for the page.
 */
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username);

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
     // Revalidate the data every 24 hours
    revalidate: 60 * 60 * 24,
  };
};
