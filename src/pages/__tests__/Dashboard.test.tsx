import { render, waitFor, screen } from '@testing-library/react';
import OrganizationService from '../../services/organization.service';
import Dashboard from '../Dashboard';

jest.mock('../../services/organization.service');

describe('Dashboard', () => {
  let getOrganizationsSpy: jest.SpyInstance;

  beforeEach(() => {
    getOrganizationsSpy = jest.spyOn(
      OrganizationService,
      'getCurrentUserOrganizations'
    );
  });

  test('displays no organizations if user belongs to no organizations', async () => {
    getOrganizationsSpy.mockResolvedValue([]);

    render(<Dashboard />);
    await waitFor(() => expect(getOrganizationsSpy).toBeCalledTimes(1));

    expect(screen.getByTestId('no_org_container')).toBeInTheDocument();
  });

  test('displays welcome if the user does belong to an organization', async () => {
    getOrganizationsSpy.mockResolvedValue([{}]);

    render(<Dashboard />);
    await waitFor(() => expect(getOrganizationsSpy).toBeCalledTimes(1));

    expect(screen.getByText('Board Moved to OrganizationBoard.tsx')).toBeInTheDocument();
  });

  afterEach(() => {
    getOrganizationsSpy.mockRestore();
  });
});
