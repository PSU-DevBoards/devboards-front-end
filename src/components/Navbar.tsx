import { useAuth0 } from '@auth0/auth0-react';
import {
  Avatar,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { BiExit, BiGroup, BiUser } from 'react-icons/bi';
import { Link } from 'react-router-dom';

/* Default pages header */
const Navbar = () => {
  const { user, logout } = useAuth0();
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      borderBottom="1px"
      mb={5}
    >
      <Heading fontWeight="light" size="xl">
        DevBoards
      </Heading>
      <Menu>
        <MenuButton>
          <Avatar name={user?.name} src={user?.picture} size="md" my={1} />
        </MenuButton>
        <MenuList>
          <Flex
            py={2}
            px={6}
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            <Avatar name={user?.name} src={user?.picture} size="md" />
            <Flex flexDirection="column" px={2}>
              <Text fontWeight="500">{user?.name}</Text>
              <Text>{user?.email}</Text>
            </Flex>
          </Flex>
          <MenuDivider />
          <MenuItem color="gray.600">
            <BiUser />
            <Text px={2}>Your Profile</Text>
          </MenuItem>
          <Link to="/organizations">
            <MenuItem color="gray.600">
              <BiGroup />
              <Text px={2}>Organizations</Text>
            </MenuItem>
          </Link>
          <MenuDivider />
          <MenuItem
            color="red.500"
            fontWeight="500"
            data-testid="logout_button"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            <BiExit />
            <Text px={2}>Logout</Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default Navbar;
