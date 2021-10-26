import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useParams } from 'react-router';
import { useOrganization } from '../../contexts/organization-context';
import OrganizationService from '../../services/organization.service';
import EditOrganization from '../EditOrganization';

jest.mock('../../contexts/organization-context');
jest.mock('react-router');
jest.mock('../../services/organization.service', () => ({
  updateOrganization: () => Promise.resolve({}),
  getOrganizationUsers: () => Promise.resolve([{ user_id: 1 }]),
}));

const useOrganizationMock: jest.Mock = useOrganization as any;
const useParamsMock: jest.Mock = useParams as any;

describe('EditOrganization', () => {
  beforeEach(() => {
    useParamsMock.mockReturnValue({
      orgId: '1',
    });

    useOrganizationMock.mockReturnValue({
      organization: { id: 1, name: 'testOrg' },
      setOrganization: () => {},
    });
  });

  test('renders an input with the current organization name', async () => {
    render(<EditOrganization />);

    await waitFor(() =>
      expect(screen.getByPlaceholderText('name')).toHaveValue('testOrg')
    );
  });

  test('updates the organization', async () => {
    const updateOrgSpy = jest.spyOn(OrganizationService, 'updateOrganization');
    updateOrgSpy.mockResolvedValue({} as any);

    render(<EditOrganization />);

    const input = screen.getByPlaceholderText('name');
    fireEvent.change(input, { target: { value: 'newName' } });

    const submit = screen.getByText('Save');
    fireEvent.click(submit);

    await waitFor(() =>
      expect(updateOrgSpy).toHaveBeenCalledWith(1, { name: 'newName' })
    );
  });

  test('renders a failure toast when update fails', async () => {
    const updateOrgSpy = jest.spyOn(OrganizationService, 'updateOrganization');
    updateOrgSpy.mockRejectedValueOnce('Bad');

    render(<EditOrganization />);

    const submit = screen.getByText('Save');
    fireEvent.click(submit);

    await waitFor(() =>
      expect(screen.getByText('Organization Update Failed')).toBeVisible()
    );
  });

  test('requires name to be filled', async () => {
    const updateOrgSpy = jest.spyOn(OrganizationService, 'updateOrganization');

    render(<EditOrganization />);

    const input = screen.getByPlaceholderText('name');
    fireEvent.change(input, { target: { value: undefined } });
    fireEvent.blur(input);

    const submit = screen.getByText('Save');
    fireEvent.click(submit);

    await waitFor(() => expect(updateOrgSpy).toBeCalledTimes(0));
  });
});
