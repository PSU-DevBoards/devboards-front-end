import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Board from '../Board';
import { useOrganization } from '../../contexts/organization-context';

jest.mock('../../services/workitem.service', () => ({
  getWorkItems: () =>
    Promise.resolve([
      {
        id: 1,
        organizationId: 1,
        name: 'test feature',
        priority: 1,
        description: '',
        status: 'IN_PROGRESS',
        type: 'FEATURE',
      },
      {
        id: 2,
        organizationId: 1,
        name: 'test story',
        priority: 1,
        description: '',
        status: 'IN_PROGRESS',
        type: 'STORY',
        parentId: 1,
      },
    ]),
  createWorkItem: () =>
    Promise.resolve({
      id: 3,
      organizationId: 1,
      name: 'test feature',
      priority: 1,
      description: '',
      status: 'IN_PROGRESS',
      type: 'FEATURE',
    }),
}));
jest.mock('../../contexts/organization-context');

const useOrganizationMock = useOrganization as jest.Mock;

describe('<Board/>', () => {
  beforeEach(() => {
    useOrganizationMock.mockReturnValue({
      organization: { id: 1, name: 'testOrg' },
    });
  });

  it('gets work items on load and renders the swim lanes', async () => {
    render(<Board />);

    await waitFor(() =>
      expect(screen.getByTestId('swimlane-1')).toBeInTheDocument()
    );
  });

  it('adds a new workitem swimlane when one is created', async () => {
    render(<Board />);

    const addItemButton = screen.getByLabelText('New Workitem');
    fireEvent.click(addItemButton);

    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'test feature' } });

    const descInput = screen.getByPlaceholderText('Description');
    fireEvent.change(descInput, { target: { value: 'description' } });

    const create = screen.getByText('Create');
    fireEvent.click(create);

    await waitFor(() =>
      expect(screen.getByTestId('swimlane-2')).toBeInTheDocument()
    );
  });
});
