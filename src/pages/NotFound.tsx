import { Button, Image, VStack } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import NotFoundIllustration from '../images/not_found.svg';

function NotFound() {
  return (
    <VStack spacing={24}>
      <Image src={NotFoundIllustration} boxSize={{ base: '100%', lg: '50%' }} />
      <Link to="/">
        <Button colorScheme="purple">Back to Dashboard</Button>
      </Link>
    </VStack>
  );
}

export default NotFound;
