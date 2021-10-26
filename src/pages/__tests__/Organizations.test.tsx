import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useUser } from '../../contexts/user-context';
import userService, { UserOrganization } from '../../services/user.service';
import Organizations from '../Organizations';
import OrganizationService from '../../services/organization.service';

jest.mock('../../services/user.service');
jest.mock('../../contexts/user-context');
jest.mock('../../services/organization.service');

const useUserMock: jest.Mock = useUser as any;

describe('Organizations', () => {
  let getOrganizationsSpy: jest.SpyInstance<Promise<UserOrganization[]>, []>;
  let deleteOrgSpy: jest.SpyInstance<Promise<string>, [id: number]>;

  beforeEach(() => {
    useUserMock.mockReturnValue({
      id: 1,
      username: 'test',
    });

    getOrganizationsSpy = jest.spyOn(
      userService,
      'getCurrentUserOrganizations'
    );

    getOrganizationsSpy.mockResolvedValue([
      {
        id: 1,
        name: 'testOrg',
        owner: {
          id: 1,
          username: 'test',
        },
      },
      {
        id: 1,
        name: 'testOrg2',
        owner: {
          id: 2,
          username: 'test2',
        },
      },
    ]);

    deleteOrgSpy = jest.spyOn(OrganizationService, 'deleteOrganization');
    deleteOrgSpy.mockResolvedValue('');
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
    expect(screen.getByText('Organization Deleted')).toBeInTheDocument();
  });

  test('displays an error when deletion fails', async () => {
    render(
      <Router>
        <Organizations />
      </Router>
    );

    const deleteButton = await waitFor(() => screen.getByLabelText('Delete'));
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByLabelText('Confirm Delete');
    fireEvent.click(confirmButton);

    deleteOrgSpy.mockRejectedValue('');

    await waitFor(() =>
      expect(
        screen.getByText('Organization Deletion Failed')
      ).toBeInTheDocument()
    );
  });

  afterEach(() => {
    useUserMock.mockRestore();
    deleteOrgSpy.mockRestore();
    getOrganizationsSpy.mockRestore();
  });
});
