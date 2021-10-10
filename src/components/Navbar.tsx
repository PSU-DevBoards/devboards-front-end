import { useAuth0 } from '@auth0/auth0-react';
import { Flex, Heading, Avatar, Menu, MenuButton, MenuList, MenuGroup, MenuItem, MenuDivider } from '@chakra-ui/react';
import PropTypes from 'prop-types';

interface Props {
    fullname: string;
    img: string;
}

/* Default pages header */
const Navbar = ({ fullname, img }: Props) => {
    const { logout } = useAuth0();
    return(
        <div>
            {/* Align header to start of page */}
            <Flex alignItems='start' justifyContent='space-between' borderBottom="1px" borderColor="black" paddingBottom="5px" px="15px">
                <Heading fontWeight='light' size='xl' >DevBoards</Heading>
                <Menu>
                <MenuButton>
                    <Avatar name={fullname} src={img}/>
                </MenuButton>
                <MenuList>
                    <MenuGroup title="Profile">
                    <MenuItem>My Account</MenuItem>
                    <MenuItem>Organizations</MenuItem>
                    </MenuGroup>
                    <MenuDivider />
                    <MenuItem color="red.500" fontWeight="500" onClick={() => logout({ returnTo: window.location.origin })}>Logout</MenuItem>
                </MenuList>
                </Menu>
            </Flex>
        </div>
    );
}

Navbar.propTypes = {
    fullname: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
}

export default Navbar;