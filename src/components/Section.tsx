import { Divider, Heading, VStack } from '@chakra-ui/react';
import React from 'react';

function Section({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <VStack borderWidth="1px" rounded="md" p={6} alignItems="initial">
      {title ? (
        <>
          <Heading align="left" fontSize="xl">
            {title}
          </Heading>
          <Divider />
        </>
      ) : null}
      {children}
    </VStack>
  );
}

export default Section;
