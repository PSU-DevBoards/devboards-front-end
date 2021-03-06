import { useAuth0 } from '@auth0/auth0-react';
import { Container, Flex, Image, Text, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AuthLoading from '../components/AuthLoading';
import Header from '../components/Header';
import LoginButton from '../components/LoginButton';
import RegisterButton from '../components/RegisterButton';
import config from '../config';
import { setAccessToken } from '../helpers/auth.helper';
import LandingIllustration from '../images/scrum_landing.svg';

const description =
  'DevBoards is built by developers, for developers. A simple, elegant, and easy-to-use scrum board framework designed to make collaborative software engineering easier. DevBoards enables agile development teams to keep track of their project features, stories, and individual tasks in real time.';

const Landing = () => {
  /* Check Auth0 status, if authenticated move away from landing page */
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const history = useHistory();

  useEffect(() => {
    if (isAuthenticated) {
      /* When authenicated, request Auth0 token and store in local storage */
      getAccessTokenSilently({
        audience: config.AUTH0_API_AUDIENCE,
        scope: 'read:current_user',
      }).then((token) => {
        setAccessToken(token);
        history.push('/dashboard');
      });
    }
  }, [isAuthenticated]);

  return isLoading ? (
    <AuthLoading />
  ) : (
    /* 10% off each side of page for 90% fluidity */
    <Container
      pt={16}
      maxW=""
      px="5%"
      h="full"
      data-testid="login_container"
      height="full"
      display="flex"
      flexDir="column"
    >
      <Header />
      {/* Align description and login/welcome container in grid to ensure responsiveness */}
      <Flex
        pt={10}
        flexDir={{ base: 'column', lg: 'row' }}
        alignItems="center"
        height="full"
      >
        {/* Create a vertical stack to align the page description and illustration below it */}
        <VStack flex={1}>
          <Text color="gray.500" fontSize="xl">
            {description}
          </Text>
          <Image
            pt={5}
            src={LandingIllustration}
            boxSize={{ base: '100%', lg: '50%' }}
          />
        </VStack>
        {/* Login/Welcome box */}
        <VStack spacing={4} width="100%" flex={1}>
          <Text fontSize="5xl">Welcome!</Text>
          <LoginButton />
          <RegisterButton />
        </VStack>
      </Flex>
    </Container>
  );
};

export default Landing;
