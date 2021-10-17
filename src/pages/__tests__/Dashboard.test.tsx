import { render, waitFor, screen } from '@testing-library/react';
import userService from '../../services/user.service';
import Dashboard from '../Dashboard';

jest.mock('../../services/user.service');

describe('Dashboard', () => {
  test('gets and displays the current user', async () => {
    const getOrganizationsSpy = jest.spyOn(
      userService,
      'getCurrentUserOrganizations'
    );
    render(<Dashboard />);
    await waitFor(() => expect(getOrganizationsSpy).toBeCalledTimes(1));
  });

  test('displays no organizations if user belongs to no organizations', async () => {
    const getOrganizationsSpy = jest.spyOn(
      userService,
      'getCurrentUserOrganizations'
    );

    getOrganizationsSpy.mockResolvedValue([]);

    render(<Dashboard />);
    await waitFor(() => expect(getOrganizationsSpy).toBeCalledTimes(1));

    expect(screen.getByTestId('no_org_container')).toBeInTheDocument();
  });
});
