import { useAuth0 } from '@auth0/auth0-react';
import { fireEvent, render, screen } from '@testing-library/react';
import Navbar from '../Navbar';

jest.mock('@auth0/auth0-react');

const useAuth0Mock: jest.Mock = useAuth0 as any;

describe('Navbar', () => {
  test('calls logout when logout button is pressed', () => {
    const logoutMock = jest.fn();
    useAuth0Mock.mockReturnValue({
      logout: logoutMock,
    });

    render(<Navbar />);

    const button = screen.getByTestId('logout_button');
    fireEvent.click(button);

    expect(logoutMock).toBeCalledWith({ returnTo: expect.any(String) });
  });

  afterAll(() => {
    useAuth0Mock.mockRestore();
  });
});
