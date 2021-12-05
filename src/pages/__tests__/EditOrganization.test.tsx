import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useParams, useHistory } from 'react-router';
import { useOrganization } from '../../contexts/organization-context';
import { useUser } from '../../contexts/user-context';
import OrganizationService, {
  Organization,
  OrganizationUser,
} from '../../services/organization.service';
import EditOrganization from '../EditOrganization';

jest.mock('../../contexts/organization-context');
jest.mock('react-router');
jest.mock('../../services/organization.service', () => ({
  updateOrganization: () => Promise.resolve({}),
  getOrganizationUsers: () => Promise.resolve([{ userId: 1 }]),

  inviteUser: () => Promise.resolve({ organizationId: 1, userId: 1, roleId: 2 }),
  deleteOrganizationUser:() => Promise.resolve({}),
  updateOrganizationUser:() => Promise.resolve({})

}));

jest.mock('../../contexts/user-context');

jest.mock('../../services/role.service', () => ({
  listRoles: () =>
    Promise.resolve([
      { id: 1, name: 'Developer' },
      { id: 2, name: 'Scrum Master' },
    ]),
}));

const useOrganizationMock: jest.Mock = useOrganization as any;
const useParamsMock: jest.Mock = useParams as any;
const pushMock = jest.fn();
const useHistoryMock: jest.Mock = useHistory as any;
const useUserMock: jest.Mock = useUser as any;

describe('EditOrganization', () => {
  let updateOrgSpy: jest.SpyInstance<
    Promise<Organization>,
    [id: number, values: Pick<Organization, 'name'>]
  >;

  let inviteUserSpy: jest.SpyInstance<
    Promise<OrganizationUser>,
    [id: number, email: string, roleId: number]
  >;

  let getOrganizationUsersSpy: jest.SpyInstance<
    Promise<Array<OrganizationUser>>,
    any
  >;

  let updateOrgUserSpy: jest.SpyInstance<
  Promise<any>,
  any
  >;
  let deleteOrganizationUserSpy:jest.SpyInstance<
    Promise<any>,any
  >;


  beforeEach(() => {
    useParamsMock.mockReturnValue({
      orgId: '1',
    });

    useOrganizationMock.mockReturnValue({
      organization: { id: 1, name: 'testOrg' },
      setOrganization: () => {},
    });

    useHistoryMock.mockReturnValue({ push: pushMock });

    updateOrgSpy = jest.spyOn(OrganizationService, 'updateOrganization');
    inviteUserSpy = jest.spyOn(OrganizationService, 'inviteUser');

    updateOrgUserSpy = jest.spyOn(OrganizationService, 'updateOrganizationUser');
    getOrganizationUsersSpy = jest.spyOn(OrganizationService, 'getOrganizationUsers');

    getOrganizationUsersSpy.mockResolvedValue([
      { userId: 1, organizationId: 1, roleId: 1 },
    ]);
    deleteOrganizationUserSpy = jest.spyOn(
      OrganizationService,
      'deleteOrganizationUser'
    );
    deleteOrganizationUserSpy.mockResolvedValue();
  });

  test('renders an input with the current organization name', async () => {
    render(<EditOrganization />);

    await waitFor(() =>
      expect(screen.getByPlaceholderText('name')).toHaveValue('testOrg')
    );
  });

  test('redirects to dashboard if fails to get organization users', async () => {
    getOrganizationUsersSpy.mockRejectedValueOnce({});

    render(<EditOrganization />);

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/dashboard'));
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
  test('updates user role', async () => {
      updateOrgUserSpy.mockResolvedValue({} as any);
      getOrganizationUsersSpy.mockResolvedValue([
            { userId: 2, organizationId: 1, roleId: 1 },]);
      render(<EditOrganization />);

      const button = await waitFor(() => screen.getByText('Edit'));
      fireEvent.click(button);

      const select = await waitFor(() => screen.getByTestId('role_select'));
      fireEvent.change(select,{target: {value: 2}});

      const submit = screen.getByText('Confirm');
      fireEvent.click(submit);

      await waitFor(() =>
        expect(updateOrgUserSpy).toHaveBeenCalledWith(1, 2, { roleId: "2" })
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

  test('does not invite user if no current organization', async () => {
    useOrganizationMock.mockReturnValue({ organization: undefined });

    render(<EditOrganization />);

    const button = screen.getByText('Invite');
    fireEvent.click(button);

    const input = screen.getByPlaceholderText('Email');
    fireEvent.change(input, { target: { value: 'test@test.com' } });

    const submit = screen.getByText('Send Invitation');
    fireEvent.click(submit);

    await waitFor(() => expect(inviteUserSpy).toHaveBeenCalledTimes(0));
  });

  test('renders a failure toast when update fails', async () => {
    updateOrgSpy.mockRejectedValueOnce({ errors: ['ErrorMessage'] });

    render(<EditOrganization />);

    const submit = screen.getByText('Save');
    fireEvent.click(submit);

    await waitFor(() => expect(screen.getByText('ErrorMessage')).toBeVisible());
  });

  test('renders a failure toast when update fails with no error message', async () => {
    updateOrgSpy.mockRejectedValueOnce({ errors: undefined });

    render(<EditOrganization />);

    const submit = screen.getByText('Save');
    fireEvent.click(submit);

    await waitFor(() =>
      expect(screen.getByText('Organization Update Failed')).toBeVisible()
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
    inviteUserSpy.mockResolvedValue({
      organizationId: 1,
      userId: 2,
      roleId: 2,
    } as any);

    render(<EditOrganization />);

    const button = screen.getByText('Invite');
    fireEvent.click(button);

    const input = screen.getByPlaceholderText('Email');
    fireEvent.change(input, { target: { value: 'test@test.com' } });

    const submit = screen.getByText('Send Invitation');
    fireEvent.click(submit);

    await waitFor(() =>
      expect(inviteUserSpy).toHaveBeenCalledWith(1, 'test@test.com', 2)
    );
  });

  test('remove user', async () => {
    useUserMock.mockReturnValue({ id: 1 });
    getOrganizationUsersSpy.mockResolvedValue([
      { userId: 1 },
      { userId: 2, organizationId: 1 },
    ]);
    render(<EditOrganization />);

    const remove = await waitFor(() => screen.getByText('Remove User'));
    fireEvent.click(remove);

    expect(deleteOrganizationUserSpy).toHaveBeenCalledWith(1, 2);
  });

  test('invite user modal requires valid email', async () => {
    inviteUserSpy.mockResolvedValue({
      organizationId: 1,
      userId: 2,
      roleId: 2,
    } as any);

    render(<EditOrganization />);

    const button = screen.getByText('Invite');
    fireEvent.click(button);

    const input = screen.getByPlaceholderText('Email');
    fireEvent.change(input, { target: { value: 'test' } });

    await waitFor(() =>
      expect(screen.getByText('Invalid email address')).toBeVisible()
    );
  });

  test('invite user modal requires entry', async () => {
    inviteUserSpy.mockResolvedValue({
      organizationId: 1,
      userId: 2,
      roleId: 2,
    } as any);

    render(<EditOrganization />);

    const button = screen.getByText('Invite');
    fireEvent.click(button);

    const input = screen.getByPlaceholderText('Email');
    fireEvent.change(input, { target: { value: ' ' } });
    fireEvent.change(input, { target: { value: '' } });

    await waitFor(() => expect(screen.getByText('Required')).toBeVisible());
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
      expect(screen.getByText('Invitation Failed')).toBeVisible()
    );
  });



  afterEach(() => {
    updateOrgSpy.mockRestore();
    useParamsMock.mockRestore();
    useOrganizationMock.mockRestore();
  });
});
