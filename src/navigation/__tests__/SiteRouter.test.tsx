import { useAuth0 } from '@auth0/auth0-react';
import { render, screen } from '@testing-library/react';
import SiteRouter from '../SiteRouter';

jest.mock('@auth0/auth0-react');
const mockedUseAuth0: jest.Mock = useAuth0 as any;

jest.mock('../routes', () => [
  {
    name: 'Authed',
    path: '/',
    authenticated: true,
    component: 'Authed',
  },
]);

describe('SiteRouter', () => {
  test('redirects when user is not authenticated', () => {
    mockedUseAuth0.mockReturnValue({
      isAuthenticated: false,
    });

    render(<SiteRouter />);

    expect(() => screen.getByText('Authed')).toThrow();
  });

  test('does not redirect if user is authenticated', () => {
    mockedUseAuth0.mockReturnValue({
      isAuthenticated: true,
    });

    render(<SiteRouter />);

    expect(screen.getByText('Authed')).toBeInTheDocument();
  });

  afterEach(() => {
    mockedUseAuth0.mockRestore();
  });
});
