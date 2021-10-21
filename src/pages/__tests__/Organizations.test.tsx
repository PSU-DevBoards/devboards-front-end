import { render, screen, waitFor } from '@testing-library/react';
import Organizations from '../Organizations';
import userService from '../../services/user.service';
import { useUser } from '../../contexts/user-context';

jest.mock('../../services/user.service');
jest.mock('../../contexts/user-context');

const useUserMock: jest.Mock = useUser as any;

describe('Organizations', () => {
  test('displays a list of organizations', async () => {
    useUserMock.mockReturnValue({
      user: {
        id: 1,
        username: 'test',
      },
    });

    const getOrganizationsSpy = jest.spyOn(
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

    render(<Organizations />);

    expect(getOrganizationsSpy).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(screen.getByText('testOrg')).toBeInTheDocument()
    );
  });
});
