import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import NoOrganization from '../NoOrganization';
import OrganizationService from '../../services/organization.service';

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

  test('displays a failure message when organization fails to complete', async () => {
    jest
      .spyOn(OrganizationService, 'createOrganization')
      .mockImplementationOnce(() => Promise.reject(new Error('Failure.')));

    render(<NoOrganization />);

    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'newOrg' } });

    const submit = screen.getByText('Create Organization');
    fireEvent.click(submit);

    await waitFor(() => {
      expect(
        screen.getByText('Organization creation failed.')
      ).toBeInTheDocument();
    });

    render(<NoOrganization />);
  });
});
