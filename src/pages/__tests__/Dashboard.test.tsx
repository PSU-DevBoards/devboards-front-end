import { render, screen, waitFor } from '@testing-library/react';
import { useHistory } from 'react-router-dom';
import OrganizationService from '../../services/organization.service';
import { getPreference } from '../../services/preference.service';
import Dashboard from '../Dashboard';

jest.mock('../../services/organization.service');
jest.mock('react-router');
jest.mock('../../services/preference.service', () => ({
  getPreference: jest.fn(),
}));

const getPreferenceMock = getPreference as jest.Mock;
const pushMock = jest.fn();
const useHistoryMock: jest.Mock = useHistory as any;

describe('Dashboard', () => {
  let getOrganizationsSpy: jest.SpyInstance;

  beforeEach(() => {
    getOrganizationsSpy = jest.spyOn(
      OrganizationService,
      'getCurrentUserOrganizations'
    );
    useHistoryMock.mockReturnValue({
      push: pushMock,
    });
  });

  test('displays no organizations if user belongs to no organizations', async () => {
    getOrganizationsSpy.mockResolvedValue([]);

    render(<Dashboard />);
    await waitFor(() => expect(getOrganizationsSpy).toBeCalledTimes(1));

    expect(screen.getByTestId('no_org_container')).toBeInTheDocument();
  });

  test('navigates to organizations if user has an org but has no default', async () => {
    getOrganizationsSpy.mockResolvedValue([{}]);
    getPreferenceMock.mockImplementation(() => Promise.reject());

    render(<Dashboard />);
    await waitFor(() => expect(getOrganizationsSpy).toBeCalledTimes(1));
    await waitFor(() => expect(getPreferenceMock).toBeCalledTimes(1));

    expect(pushMock).toHaveBeenCalledWith('/organizations');
  });

  test('navigates to default organization if present', async () => {
    getOrganizationsSpy.mockResolvedValue([{ id: 1 }]);
    getPreferenceMock.mockResolvedValue(1);

    render(<Dashboard />);
    await waitFor(() => expect(getOrganizationsSpy).toBeCalledTimes(1));
    await waitFor(() => expect(getPreferenceMock).toBeCalledTimes(1));

    expect(pushMock).toHaveBeenCalledWith('/organizations/1');
  });

  test('navigates to organizations has default org but not valid', async () => {
    getOrganizationsSpy.mockResolvedValue([{ id: 2 }]);
    getPreferenceMock.mockResolvedValue(1);

    render(<Dashboard />);
    await waitFor(() => expect(getOrganizationsSpy).toBeCalledTimes(1));
    await waitFor(() => expect(getPreferenceMock).toBeCalledTimes(1));

    expect(pushMock).toHaveBeenCalledWith('/organizations');
  });

  afterEach(() => {
    getOrganizationsSpy.mockRestore();
    getPreferenceMock.mockClear();
    pushMock.mockClear();
  });
});
