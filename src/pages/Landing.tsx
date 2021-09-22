import { Container, Heading, Flex, Center, Divider, VStack, Text, Box, SimpleGrid, Button } from '@chakra-ui/react';
import {ReactComponent as LandingIllustration} from '../images/scrum_landing.svg';

const Header = "DevBoards";
const Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const Landing = () => (
        /* 10% off each side of page for 90% fluidity */
        <Container pt={24} maxW='' px='5%'>
            {/* Align header to start of page */}
            <Flex alignItems='start' >
              <Heading fontWeight='light' size='4xl' >{ Header }</Heading>
            </Flex>

            {/* Header & description divider */}
            <Divider my={3}/>

            {/* Align description and login/welcome container in grid to ensure responsiveness */}
            <SimpleGrid
                pt={5}
                columns={{ sm: 1, md: 1, lg: 1, xl: 2 }}
                spacingX='80px'
                spacingY='50px'
            >

              { /* Create a vertical stack to align the page description and illustration below it */ }
              <VStack>
                <Text color='gray.500' fontSize='xl'>{ Description }</Text>
                <Center pt={2}>
                    <LandingIllustration
                        width='500px'
                        height='auto'
                    />
                </Center>
              </VStack>

              { /* Login/Welcome box */ }
              <Box
                boxShadow='xl'
                rounded='md'
                bg='white'
                maxW='100%'
                height='500px'
                minHeight='300px'
                alignSelf='center'
            >
                  <Flex alignItems='center' justifyContent='center' pt='10%'>
                  { /* Vertical stack to align Welcome, login, and register buttons */ }
                    <VStack
                        pt={2}
                        spacing={4}
                        width='100%'
                    >
                      <Text fontSize='5xl'>
                          Welcome!
                      </Text>
                      <Button colorScheme="black" variant="outline" width="50%">Log in</Button>
                      <Button colorScheme="black" variant="outline" width="50%">Register</Button>
                    </VStack>
                  </Flex>
              </Box>
            </SimpleGrid>
        </Container>
    );

export default Landing;