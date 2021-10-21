import { Flex, Box, Input, Button, Text, useToast } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import OrganizationService from '../services/organization.service';

/* Default pages header */
const NoOrganization = () => {
  const history = useHistory();
  const [progress, setProgress] = useState(0);
  const toast = useToast();

  /* --------------------------------- Methods -------------------------------- */
  const onSubmitForm = (values: Record<string, string>) => {
    let toastTitle = 'Organization created.';
    let toastDescription = '';
    let toastStatus = 'success';
    setProgress(80);

    OrganizationService.createOrganization(values.orgName)
      .then((organization) => {
        toastDescription = `We've successfully created "${organization.name}" for you.`;
        /* Redirect */
        history.push('/');
      })
      .catch(() => {
        /* Request Failed */
        toastTitle = 'Organization creation failed.';
        toastDescription = `Error creating organization ${values.orgName}, try again later`;
        toastStatus = 'error';
      })
      .finally(() => {
        toast({
          position: 'bottom-right',
          title: toastTitle,
          description: toastDescription,
          status: toastStatus as any,
          duration: 5000,
          isClosable: false,
        });

        setProgress(100);
      });
  };

  /* ---------------------------------- Hooks --------------------------------- */
  const {
    handleSubmit,
    handleChange,
    values: { orgName },
  } = useFormik({
    initialValues: {
      orgName: '',
    },
    onSubmit: onSubmitForm,
  });

  /* --------------------------------- Render --------------------------------- */
  return (
    <>
      <LoadingBar
        color="#A0AEC0"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Flex justifyContent="center" pt="10%" data-testid="no_org_container">
        <Box
          boxShadow="xl"
          rounded="md"
          bg="white"
          alignSelf="center"
          flexDirection="column"
          py={10}
          px={10}
          width={{ sm: '90%', md: '80%', lg: '80%', xl: '50%' }}
        >
          <Text fontSize={['24px', '24px', '30px', '40px', '44px']}>
            You do not currently own or belong to any organization.
          </Text>
          <Text fontSize={['14px', '14px', '20px', '20px', '24px']}>
            Please create one below to begin using DevBoards.
          </Text>
          <form onSubmit={handleSubmit}>
            <Flex pt={5} justifyContent="center" alignItems="center">
              <Input
                errorBorderColor="red.300"
                placeholder="Name"
                maxWidth={500}
                mr={2}
                w={['100%', '100%', '70%']}
                id="orgName"
                name="orgName"
                onChange={handleChange}
                value={orgName}
              />
              <Button type="submit" w={['100%', '100%', '30%', '30%']}>
                Create Organization
              </Button>
            </Flex>
          </form>
        </Box>
      </Flex>
    </>
  );
};

export default NoOrganization;
