import { useAuth0 } from '@auth0/auth0-react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginButton from '../LoginButton';

jest.mock('@auth0/auth0-react');

const useAuth0Mock: jest.Mock = useAuth0 as any;

describe('LoginButton', () => {
  test('calls login with redirect when pressed', () => {
    const loginWithRedirectMock = jest.fn();
    useAuth0Mock.mockReturnValue({
      loginWithRedirect: loginWithRedirectMock,
    });

    render(<LoginButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(loginWithRedirectMock).toBeCalledWith();
  });

  afterAll(() => {
    useAuth0Mock.mockRestore();
  });
});
