import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useOrganization } from '../../contexts/organization-context';
import EditWorkItemModal from '../EditWorkItemModal';
import WorkitemService, { WorkItem } from '../../services/workitem.service';

jest.mock('../../contexts/organization-context');
jest.mock('../../services/organization.service');
jest.mock('../../services/workitem.service');

const useOrganizationMock: jest.Mock = useOrganization as any;

describe('EditWorkItemModal', () => {
  let createWorkItemSpy: jest.SpyInstance<
    Promise<WorkItem>,
    [orgId: number, workItem: Pick<WorkItem, 'name'>]
  >;
  let updateWorkItemSpy: jest.SpyInstance<
    Promise<WorkItem>,
    [
      orgId: number,
      workItemId: number,
      workItem: Partial<Pick<WorkItem, 'name' | 'status'>>
    ]
  >;
  let mockWorkItem: WorkItem;
  const workItemSaved = jest.fn();
  const onClose = jest.fn();

  beforeAll(() => {
    mockWorkItem = {
      id: 1,
      organizationId: 1,
      name: 'test feature',
      priority: 1,
      description: '',
      status: 'IN_PROGRESS',
      type: 'FEATURE',
      estimate: 1,
    };

    workItemSaved.mockReturnValue(mockWorkItem);
    onClose.mockReturnValue({});
  });

  beforeEach(() => {
    useOrganizationMock.mockReturnValue({
      organization: { id: 1, name: 'testOrg' },
    });

    createWorkItemSpy = jest.spyOn(WorkitemService, 'createWorkItem');

    createWorkItemSpy.mockResolvedValue(mockWorkItem);

    updateWorkItemSpy = jest.spyOn(WorkitemService, 'updateWorkItem');

    updateWorkItemSpy.mockResolvedValue(mockWorkItem);
  });

  test('Modal title is derived from work item ID when one is passed', async () => {
    render(
      <EditWorkItemModal
        workItemType="FEATURE"
        isOpen
        onWorkItemSaved={workItemSaved}
        onClose={onClose}
        workItem={mockWorkItem}
      />
    );

    expect(screen.getByLabelText('Edit Work Item Header')).toHaveTextContent(
      'Edit F-1'
    );
  });

  test('Modal title is derived from work item type when one is not passed', async () => {
    render(
      <EditWorkItemModal
        workItemType="FEATURE"
        isOpen
        onWorkItemSaved={workItemSaved}
        onClose={onClose}
      />
    );

    expect(screen.getByLabelText('Edit Work Item Header')).toHaveTextContent(
      'New Feature'
    );
  });

  test('submits a post work item request for feature', async () => {
    render(
      <EditWorkItemModal
        workItemType="FEATURE"
        isOpen
        onWorkItemSaved={workItemSaved}
        onClose={onClose}
      />
    );

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

  test('submits a post work item request for story', async () => {
    render(
      <EditWorkItemModal
        workItemType="STORY"
        isOpen
        onWorkItemSaved={workItemSaved}
        onClose={onClose}
      />
    );

    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'test feature' } });

    const descInput = screen.getByPlaceholderText('Description');
    fireEvent.change(descInput, { target: { value: 'description' } });

    const priorityInput = screen.getByLabelText('Priority Input');
    fireEvent.change(priorityInput, { target: { value: 2 } });

    const estimateInput = screen.getByLabelText('Estimate Input');
    fireEvent.change(estimateInput, { target: { value: 2 } });

    const create = screen.getByText('Create');
    fireEvent.click(create);

    await waitFor(() => {
      expect(
        screen.getByText(`Story "test feature" successfully created.`)
      ).toBeInTheDocument();
    });
  });

  test('displays a failure message when work item creation fails to complete', async () => {
    createWorkItemSpy.mockImplementationOnce(() =>
      Promise.reject(new Error('Failure.'))
    );

    render(
      <EditWorkItemModal
        workItemType="FEATURE"
        isOpen
        onWorkItemSaved={workItemSaved}
        onClose={onClose}
      />
    );

    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'test feature' } });

    const descInput = screen.getByPlaceholderText('Description');
    fireEvent.change(descInput, { target: { value: 'description' } });

    const create = screen.getByText('Create');
    fireEvent.click(create);

    await waitFor(() =>
      expect(
        screen.getByText(
          'Error creating Feature "test feature", try again later'
        )
      ).toBeInTheDocument()
    );
  });

  test('displays a success message when work item modification completed', async () => {
    render(
      <EditWorkItemModal
        parentId={mockWorkItem.parentId}
        workItem={mockWorkItem}
        workItemType="STORY"
        isOpen
        onWorkItemSaved={workItemSaved}
        onClose={onClose}
      />
    );

    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'new name' } });

    const descInput = screen.getByPlaceholderText('Description');
    fireEvent.change(descInput, { target: { value: 'description' } });

    const edit = screen.getByText('Edit');
    fireEvent.click(edit);

    await waitFor(() =>
      expect(
        screen.getByText('Story "new name" successfully modified.')
      ).toBeInTheDocument()
    );
  });

  test('displays a failure message when work item modification fails to complete', async () => {
    updateWorkItemSpy.mockImplementationOnce(() =>
      Promise.reject(new Error('Failure.'))
    );

    render(
      <EditWorkItemModal
        parentId={mockWorkItem.parentId}
        workItem={mockWorkItem}
        workItemType="STORY"
        isOpen
        onWorkItemSaved={workItemSaved}
        onClose={onClose}
      />
    );

    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'test story' } });

    const descInput = screen.getByPlaceholderText('Description');
    fireEvent.change(descInput, { target: { value: 'description' } });

    const edit = screen.getByText('Edit');
    fireEvent.click(edit);

    await waitFor(() =>
      expect(
        screen.getByText('Error modifying Story "test story", try again later')
      ).toBeInTheDocument()
    );
  });

  test('sets a description from the description helper', async () => {
    render(
      <EditWorkItemModal
        workItemType="FEATURE"
        isOpen
        onWorkItemSaved={workItemSaved}
        onClose={onClose}
      />
    );

    const openDescHelperButton = screen.getByLabelText(
      'open description helper'
    );
    fireEvent.click(openDescHelperButton);

    await waitFor(() =>
      expect(
        screen.getByDisplayValue('I can accomplish my goal!')
      ).toBeInTheDocument()
    );

    const submitDescButton = screen.getByLabelText('submit description');
    fireEvent.click(submitDescButton);

    await waitFor(() => {
      expect(
        screen.getByDisplayValue(
          'As a user I want to do a thing so that I can accomplish my goal!'
        )
      ).toBeInTheDocument();
    });
  });
});
