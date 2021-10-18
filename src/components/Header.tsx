import { Heading, Divider } from '@chakra-ui/react';

/* Default pages header */
const Header = () => (
  <>
    <Heading fontWeight="light" size="4xl" textAlign="left">
      DevBoards
    </Heading>
    {/* Header & description divider */}
    <Divider my={3} />
  </>
);

export default Header;
