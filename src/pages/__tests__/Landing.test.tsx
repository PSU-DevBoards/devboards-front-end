import { render, screen } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import Landing from '../Landing';

jest.mock('@auth0/auth0-react');
const mockedUseAuth0: jest.Mock = useAuth0 as any;

describe('Landing', () => {
  test('shows the loading indicator while loading', () => {
    mockedUseAuth0.mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
    });

    render(<Landing />);

    expect(screen.getByLabelText('Loading Indicator')).toBeInTheDocument();
  });

  test('renders the login container when not authenticated', () => {
    mockedUseAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
    });

    render(<Landing />);

    expect(screen.getByTestId('login_container')).toBeInTheDocument();
  });

  test('gets an access token if authenticated', () => {
    mockedUseAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      getAccessTokenSilently: () => Promise.resolve({}),
    });

    render(<Landing />);
  });

  afterEach(() => {
    mockedUseAuth0.mockRestore();
  });
});
