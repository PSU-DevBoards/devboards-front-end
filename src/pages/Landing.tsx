import { useAuth0 } from '@auth0/auth0-react';
import LoadingBar from 'react-top-loading-bar'
import {ReactComponent as LandingIllustration} from '../images/scrum_landing.svg';
import LoginButton from '../components/LoginButton';
import RegisterButton from '../components/RegisterButton';
import Header from '../components/Header';
import LoginButton from '../components/LoginButton';
import RegisterButton from '../components/RegisterButton';
import config from '../config';
import { setAccessToken } from '../helpers/auth.helper';
import { ReactComponent as LandingIllustration } from '../images/scrum_landing.svg';

const description =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const Landing = () => {
    /* Check Auth0 status, if authenticated move away from landing page */
    const { isLoading } = useAuth0();

    if( isLoading ){
        return( 
            <LoadingBar
                color='#4A5568'
                progress={90}
                loaderSpeed={1000}
            />
        )
    }
  }, [isAuthenticated]);

  return isLoading ? (
    <AuthLoading />
  ) : (
    /* 10% off each side of page for 90% fluidity */
    <Container pt={24} maxW="" px="5%" data-testid="login_container">
      <Header />

      {/* Align description and login/welcome container in grid to ensure responsiveness */}
      <SimpleGrid
        pt={5}
        columns={{ sm: 1, md: 1, lg: 1, xl: 2 }}
        spacingX="80px"
        spacingY="50px"
      >
        {/* Create a vertical stack to align the page description and illustration below it */}
        <VStack>
          <Text color="gray.500" fontSize="xl">
            {description}
          </Text>
          <Center pt={2} width="100%">
            <LandingIllustration width="700px" />
          </Center>
        </VStack>

        {/* Login/Welcome box */}
        <Box
          boxShadow="xl"
          rounded="md"
          bg="white"
          maxW="100%"
          height="500px"
          minHeight="300px"
          alignSelf="center"
        >
          <Flex alignItems="center" justifyContent="center" pt="10%">
            {/* Vertical stack to align Welcome, login, and register buttons */}
            <VStack pt={2} spacing={4} width="100%">
              <Text fontSize="5xl">Welcome!</Text>
              <LoginButton />
              <RegisterButton />
            </VStack>
          </Flex>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default Landing;
