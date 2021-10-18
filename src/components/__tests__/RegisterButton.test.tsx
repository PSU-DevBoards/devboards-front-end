import { useAuth0 } from '@auth0/auth0-react';
import { render, screen, fireEvent } from '@testing-library/react';
import RegisterButton from '../RegisterButton';

jest.mock('@auth0/auth0-react');

const useAuth0Mock: jest.Mock = useAuth0 as any;

describe('RegisterButton', () => {
  test('calls login with redirect with signup hint when pressed', () => {
    const loginWithRedirectMock = jest.fn();
    useAuth0Mock.mockReturnValue({
      loginWithRedirect: loginWithRedirectMock,
    });

    render(<RegisterButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(loginWithRedirectMock).toBeCalledWith({ screen_hint: 'signup' });
  });

  afterAll(() => {
    useAuth0Mock.mockRestore();
  });
});
