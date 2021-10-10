import { Flex, CircularProgress, Heading, Text } from '@chakra-ui/react';
import Header from './Header';

/* Page for transitions while Auth0 is loading */
const AuthLoading = () => (
    <Flex pt={24} maxW='' px='5%' height="100vh" flexDirection="column" >
        <Header/>
        <Flex flex={1} justifyContent="center" alignItems="center">
            <Flex boxShadow='xl' rounded='md' bg='white' padding="25px">
                <CircularProgress isIndeterminate color="black" size="20" marginRight="50px" marginBottom="10px" marginTop="10px" />
                <Flex alignSelf="center" flexFlow="column">
                    <Heading fontWeight='medium' size='2xl' marginBottom='5px'>Hang on tight!</Heading>
                    <Text fontWeight='light' size='2xl'>You&apos;re being redirected...</Text>
                </Flex>
            </Flex>
        </Flex>
    </Flex>
);

export default AuthLoading;