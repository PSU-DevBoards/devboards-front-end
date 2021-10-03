import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@chakra-ui/react';

/* Provides component for triggering logout from Auth0 */
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