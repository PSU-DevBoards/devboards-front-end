import { render, screen, waitFor } from '@testing-library/react';
import userService from '../../services/user.service';
import Dashboard from '../Dashboard';

jest.mock('../../services/user.service');

describe('Dashboard', () => {
  test('gets and displays the current user', async () => {
    const getCurrentUserSpy = jest.spyOn(userService, 'getCurrentUser');
    render(<Dashboard />);
    await waitFor(() => expect(getCurrentUserSpy).toBeCalledTimes(1));
    expect(screen.getByText('testUser')).toBeInTheDocument();
  });
});
