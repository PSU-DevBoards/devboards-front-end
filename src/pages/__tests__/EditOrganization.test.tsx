import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useParams } from 'react-router';
import { useOrganization } from '../../contexts/organization-context';
import OrganizationService, {
  Organization,
  OrganizationUser
} from '../../services/organization.service';
import EditOrganization from '../EditOrganization';

jest.mock('../../contexts/organization-context');
jest.mock('react-router');
jest.mock('../../services/organization.service', () => ({
  updateOrganization: () => Promise.resolve({}),
  getOrganizationUsers: () => Promise.resolve([{ user_id: 1 }]),
  inviteUser: () => Promise.resolve({ organization_id: 1, user_id: 1, role_id: 2 }),
}));

const useOrganizationMock: jest.Mock = useOrganization as any;
const useParamsMock: jest.Mock = useParams as any;

describe('EditOrganization', () => {
  let updateOrgSpy: jest.SpyInstance<
    Promise<Organization>,
    [id: number, values: Pick<Organization, 'name'>]
  >;

  let inviteUserSpy: jest.SpyInstance<
    Promise<OrganizationUser>,
    [id: number, values: Pick<OrganizationUser, 'user_id'>]
  >;

  beforeEach(() => {
    useParamsMock.mockReturnValue({
      orgId: '1',
    });

    useOrganizationMock.mockReturnValue({
      organization: { id: 1, name: 'testOrg' },
      setOrganization: () => {},
    });

    updateOrgSpy = jest.spyOn(OrganizationService, 'updateOrganization');
  });

  test('renders an input with the current organization name', async () => {
    render(<EditOrganization />);

    await waitFor(() =>
      expect(screen.getByPlaceholderText('name')).toHaveValue('testOrg')
    );
  });

  test('updates the organization', async () => {
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

  test('does not update the organization if no current organization', async () => {
    useOrganizationMock.mockReturnValue({ organization: undefined });

    render(<EditOrganization />);

    const input = screen.getByPlaceholderText('name');
    fireEvent.change(input, { target: { value: 'newName' } });

    const submit = screen.getByText('Save');
    fireEvent.click(submit);

    await waitFor(() => expect(updateOrgSpy).toHaveBeenCalledTimes(0));
  });

  test('renders a failure toast when update fails', async () => {
    updateOrgSpy.mockRejectedValueOnce({ errors: ['ErrorMessage'] });

    render(<EditOrganization />);

    const submit = screen.getByText('Save');
    fireEvent.click(submit);

    await waitFor(() =>
      expect(screen.getByText('ErrorMessage')).toBeVisible()
    );
  });

  test('requires name to be filled', async () => {
    render(<EditOrganization />);

    const input = screen.getByPlaceholderText('name');
    fireEvent.change(input, { target: { value: undefined } });
    fireEvent.blur(input);

    const submit = screen.getByText('Save');
    fireEvent.click(submit);

    await waitFor(() => expect(updateOrgSpy).toBeCalledTimes(0));
  });

  test('invite user', async () => {
    inviteUserSpy.mockResolvedValue({ organization_id: 1, user_id: 2, role_id: 2 } as any);

    render(<EditOrganization />);

    const button = screen.getByText('Invite');
    fireEvent.click(button);

    const input = screen.getByPlaceholderText('Email');
    fireEvent.change(input, { target: { value: 'test@test.com' } });

    const submit = screen.getByText('Send Invitation');
    fireEvent.click(submit);

    await waitFor(() =>
      expect(inviteUserSpy).toHaveBeenCalledWith(1, { email: 'test@test.com', role_id: 2 })
    );
  });

  test('renders a failure toast when invite user fails', async () => {
    inviteUserSpy.mockRejectedValueOnce({ errors: ['ErrorMessage'] });

    render(<EditOrganization />);

    const button = screen.getByText('Invite');
    fireEvent.click(button);

    const input = screen.getByPlaceholderText('Email');
    fireEvent.change(input, { target: { value: 'test@test.com' } });

    const submit = screen.getByText('Send Invitation');
    fireEvent.click(submit);

    await waitFor(() =>
      expect(screen.getByText('ErrorMessage')).toBeVisible()
    );
  });

  afterEach(() => {
    updateOrgSpy.mockRestore();
    useParamsMock.mockRestore();
    useOrganizationMock.mockRestore();
  });
});
