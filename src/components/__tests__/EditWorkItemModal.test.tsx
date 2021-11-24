import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useOrganization } from '../../contexts/organization-context';
import EditWorkItemModal from '../EditWorkItemModal';
import WorkitemService, { WorkItem } from '../../services/workitem.service';

jest.mock('../../contexts/organization-context');
jest.mock('../../services/organization.service');
jest.mock('../../services/workitem.service');

const useOrganizationMock: jest.Mock = useOrganization as any;

describe('EditWorkItemModal', () => {
  let createWorkItemSpy: jest.SpyInstance<Promise<WorkItem>, [orgId: number, workItem: Pick<WorkItem, "name">]>;
  let mockWorkItem : WorkItem;
  let workItemSaved = jest.fn();
  let onClose = jest.fn();

  beforeAll(() => {
    mockWorkItem = {
      id: 1,
      organizationId: 1,
      name: "test feature",
      priority: 1,
      description: "",
      status: "IN_PROGRESS",
      type: "FEATURE",
    };

    workItemSaved.mockReturnValue(mockWorkItem);
    onClose.mockReturnValue({});
  });

  beforeEach(() => {
    useOrganizationMock.mockReturnValue({
      organization: { id: 1, name: 'testOrg' },
    });

    createWorkItemSpy = jest.spyOn(
      WorkitemService,
      'createWorkItem'
    );
    
    createWorkItemSpy.mockResolvedValue(mockWorkItem);
  });

  test('Modal title is derived from work item ID when one is passed', async () => {
    render(<EditWorkItemModal
        workItemType="FEATURE"
        isOpen={true}
        onWorkItemSaved={workItemSaved}
        onClose={onClose}
        workItem={mockWorkItem}
    />);

    expect(screen.getByLabelText('Edit Work Item Header')).toHaveTextContent('Edit F-1');
  });

  test('Modal title is derived from work item type when one is not passed', async () => {
    render(<EditWorkItemModal
        workItemType="FEATURE"
        isOpen={true}
        onWorkItemSaved={workItemSaved}
        onClose={onClose}
    />);

    expect(screen.getByLabelText('Edit Work Item Header')).toHaveTextContent('New Feature');
  });

  test('submits a post work item request for feature', async () => {
    render(<EditWorkItemModal
      workItemType="FEATURE"
      isOpen={true}
      onWorkItemSaved={workItemSaved}
      onClose={onClose}
    />);

    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'test feature' } });

    const descInput = screen.getByPlaceholderText('Description');
    fireEvent.change(descInput, { target: { value: 'description' } });

    const create = screen.getByText('Create');
    fireEvent.click(create);

    await waitFor(() => {
      expect(
        screen.getByText(`Feature "test feature" successfully created.`)
      ).toBeInTheDocument();
    });
  });

  test('displays a failure message when work item creation fails to complete', async () => {
    createWorkItemSpy.mockImplementationOnce(() => Promise.reject(new Error('Failure.')));

    render(<EditWorkItemModal
      workItemType="FEATURE"
      isOpen={true}
      onWorkItemSaved={workItemSaved}
      onClose={onClose}
    />);

    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'test feature' } });

    const descInput = screen.getByPlaceholderText('Description');
    fireEvent.change(descInput, { target: { value: 'description' } });

    const create = screen.getByText('Create');
    fireEvent.click(create);

    await waitFor(() =>
      expect(
        screen.getByText('Error creating Feature "test feature", try again later')
      ).toBeInTheDocument()
    );
  });
});
