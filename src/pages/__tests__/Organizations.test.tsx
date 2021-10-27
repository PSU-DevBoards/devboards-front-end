import {
  render,
  screen,
  waitFor,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useUser } from '../../contexts/user-context';
import userService, { UserOrganization } from '../../services/user.service';
import Organizations from '../Organizations';
import OrganizationService, {
  Organization,
} from '../../services/organization.service';

jest.mock('../../services/user.service');
jest.mock('../../contexts/user-context');
jest.mock('../../services/organization.service');

const useUserMock: jest.Mock = useUser as any;

const triggerCreation = async () => {
  const createButton = screen.getByLabelText('Create Organization');
  fireEvent.click(createButton);

  const nameInput = await waitFor(() => screen.getByPlaceholderText('name'));
  fireEvent.change(nameInput, { target: { value: 'newOrg' } });

  const saveButton = screen.getByLabelText('Confirm Create Organization');
  fireEvent.click(saveButton);
};

describe('Organizations', () => {
  let getOrganizationsSpy: jest.SpyInstance<Promise<UserOrganization[]>, []>;
  let deleteOrgSpy: jest.SpyInstance<Promise<string>, [id: number]>;
  let createOrgSpy: jest.SpyInstance<Promise<Organization>, [name: string]>;

  beforeEach(() => {
    const org1 = {
      id: 1,
      name: 'testOrg',
      owner: {
        id: 1,
        username: 'test',
      },
    };

    const org2 = {
      id: 1,
      name: 'testOrg2',
      owner: {
        id: 2,
        username: 'test2',
      },
    };

    useUserMock.mockReturnValue({
      id: 1,
      username: 'test',
    });

    getOrganizationsSpy = jest.spyOn(
      userService,
      'getCurrentUserOrganizations'
    );

    getOrganizationsSpy.mockResolvedValue([org1, org2]);

    deleteOrgSpy = jest.spyOn(OrganizationService, 'deleteOrganization');
    deleteOrgSpy.mockResolvedValue('');

    createOrgSpy = jest.spyOn(OrganizationService, 'createOrganization');
    createOrgSpy.mockResolvedValue({ ...org1, name: 'createdOrg' });
  });

  test('displays a list of organizations', async () => {
    render(
      <Router>
        <Organizations />
      </Router>
    );

    expect(getOrganizationsSpy).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(screen.getByText('testOrg')).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByLabelText('Delete')).toBeInTheDocument()
    );
  });

  test('allows an owner to delete an organization', async () => {
    render(
      <Router>
        <Organizations />
      </Router>
    );

    const deleteButton = await waitFor(() => screen.getByLabelText('Delete'));
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByLabelText('Confirm Delete');
    fireEvent.click(confirmButton);

    await waitFor(() => expect(deleteOrgSpy).toBeCalledTimes(1));
    expect(screen.getByText('Organization Deleted')).toBeVisible();
  });

  test('displays an error when deletion fails', async () => {
    deleteOrgSpy.mockRejectedValue('');

    render(
      <Router>
        <Organizations />
      </Router>
    );

    const deleteButton = await waitFor(() => screen.getByLabelText('Delete'));
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByLabelText('Confirm Delete');
    fireEvent.click(confirmButton);

    await waitFor(() =>
      expect(screen.getByText('Organization Deletion Failed')).toBeVisible()
    );
  });

  test('requires an organization name to create an organization', async () => {
    render(
      <Router>
        <Organizations />
      </Router>
    );

    const createButton = screen.getByLabelText('Create Organization');
    fireEvent.click(createButton);

    const nameInput = await waitFor(() => screen.getByPlaceholderText('name'));
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.blur(nameInput);

    const saveButton = screen.getByLabelText('Confirm Create Organization');
    fireEvent.click(saveButton);

    await waitFor(() => expect(createOrgSpy).toHaveBeenCalledTimes(0));
  });

  test('creates a new organization', async () => {
    render(
      <Router>
        <Organizations />
      </Router>
    );

    triggerCreation();

    await waitFor(() =>
      expect(screen.findAllByText('Organization Created')).toBeTruthy()
    );
  });

  test('displays an error when create fails', async () => {
    createOrgSpy.mockRejectedValue({});

    render(
      <Router>
        <Organizations />
      </Router>
    );

    triggerCreation();

    await waitFor(() =>
      expect(screen.getByText('Organization Creation Failed')).toBeVisible()
    );
  });

  afterEach(() => {
    useUserMock.mockRestore();
    deleteOrgSpy.mockRestore();
    getOrganizationsSpy.mockRestore();
    createOrgSpy.mockRestore();
    cleanup();
  });
});
