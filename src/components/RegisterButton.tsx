import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@chakra-ui/react';

/* Provides component for triggering redirect to Auth0's registration page */
const RegisterButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      colorScheme="black"
      variant="outline"
      width="50%"
      onClick={() => loginWithRedirect({ screen_hint: 'signup' })}
    >
      Register
    </Button>
  );
};

export default RegisterButton;
