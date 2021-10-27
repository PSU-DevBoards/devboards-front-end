import { render, screen, waitFor } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import UserService, { User } from '../../services/user.service';
import { useUser, UserProvider } from '../user-context';

jest.mock('@auth0/auth0-react');
jest.mock('../../services/user.service');

const useAuth0Mock = useAuth0 as jest.Mock;

const UserConsumer = () => {
  const user = useUser();

  return <p>{user?.username}</p>;
};

describe('User Context', () => {
  let getUserSpy: jest.SpyInstance<Promise<User>, []>;

  beforeEach(() => {
    useAuth0Mock.mockReturnValue({ isAuthenticated: true });

    getUserSpy = jest.spyOn(UserService, 'getCurrentUser');
  });

  test('gets the current user if authenticated', () => {
    render(
      <UserProvider>
        <p>TEST</p>
      </UserProvider>
    );

    expect(getUserSpy).toBeCalledTimes(1);
  });

  test('does not get the current user if not authenticated', () => {
    useAuth0Mock.mockReturnValue({ isAuthenticated: false });

    render(
      <UserProvider>
        <p>TEST</p>
      </UserProvider>
    );

    expect(getUserSpy).toBeCalledTimes(0);
  });

  test('makes the user context available to a consumer', async () => {
    getUserSpy.mockResolvedValue({ username: 'Test' } as any);

    render(
      <UserProvider>
        <UserConsumer />
      </UserProvider>
    );

    await waitFor(() => expect(screen.getByText('Test')).toBeInTheDocument());
  });

  afterEach(() => {
    useAuth0Mock.mockRestore();
    getUserSpy.mockRestore();
  });
});
