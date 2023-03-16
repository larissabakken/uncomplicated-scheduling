import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
} from "@ignite-ui/react";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../lib/axios";
import { buildNextAuthOptions } from "../../api/auth/[...nextAuth].api";
import { Container, Header } from "../styles";
import { FormAnnotation, ProfileBox } from "./styles";

/**
 * Schema for validating user profile data.
 */
const updateProfileSchema = z.object({
  bio: z.string(),
});

type UpdateProfileData = z.infer<typeof updateProfileSchema>;

/**
 * UpdateProfile component.
 * @returns JSX.Element
 */
export default function UpdateProfile() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  });

  const session = useSession();
  const router = useRouter();

  /**
   * Updates user profile data on form submission.
   * @param data {UpdateProfileData} data - User profile data.
   * @returns {Promise<void>} Promise that resolves when data is updated and route is pushed.
   */
  async function handleUpdateProfile(data: UpdateProfileData) {
    await api.put("/users/profile", {
      bio: data.bio,
    });

    await router.push(`/schedule/${session.data?.user.username}`);
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

          <MultiStep size={4} currentStep={4} />
        </Header>

        <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
          <label>
            <Text>Profile picture</Text>
            <Avatar
              src={session.data?.user.avatar_url}
              referrerPolicy="no-referrer"
              alt={session.data?.user.name}
            />
          </label>

          <label>
            <Text size="sm">About you</Text>
            <TextArea {...register("bio")} />
            <FormAnnotation size="sm">
              Tell us a little about yourself. This will be displayed on your
              personal page.
            </FormAnnotation>
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Finish
            <ArrowRight />
          </Button>
        </ProfileBox>
      </Container>
    </>
  );
}

/**
 * Retrieves server-side props for the component.
 * @param {Object} context - Context object.
 * @returns {Promise<Object>} Promise that resolves with session object.
 */
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res)
  );

  return {
    props: {
      session,
    },
  };
};
