import { render, waitFor } from '@testing-library/react';
import userService from '../../services/user.service';
import Dashboard from '../Dashboard';

jest.mock('../../services/user.service');

describe('Dashboard', () => {
  test('gets and displays the current user', async () => {
    const getCurrentUserSpy = jest.spyOn(
      userService,
      'getCurrentUserOrganizations'
    );
    render(<Dashboard />);
    await waitFor(() => expect(getCurrentUserSpy).toBeCalledTimes(1));
  });
});
