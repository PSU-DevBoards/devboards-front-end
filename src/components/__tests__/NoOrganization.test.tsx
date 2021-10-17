import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useHistory } from 'react-router-dom';
import NoOrganization from '../NoOrganization';

jest.mock('../../services/organization.service');

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

describe('NoOrganization', () => {
  test('submits a post organization request', async () => {
    render(<NoOrganization />);

    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'newOrg' } });

    const submit = screen.getByText('Create Organization');
    fireEvent.click(submit);

    await waitFor(() => {
      expect(
        screen.getByText(`We've successfully created "newOrg" for you.`)
      ).toBeInTheDocument();
    });
  });
});
