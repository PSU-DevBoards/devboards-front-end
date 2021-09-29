import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@chakra-ui/react';

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <Button
            colorScheme="black"
            variant="outline"
            width="50%"
            onClick={() => loginWithRedirect()}>
            Log in
        </Button>
    );
}

export default LoginButton;