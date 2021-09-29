import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@chakra-ui/react';

const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <Button
            colorScheme="black"
            variant="outline"
            width="50%"
            onClick={() => logout({ returnTo: window.location.origin })}>
            Log out
        </Button>
    );
}

export default LogoutButton;