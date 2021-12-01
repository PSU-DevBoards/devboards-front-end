import { Accordion } from '@chakra-ui/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useOrganization } from '../../contexts/organization-context';
import WorkitemService, { WorkItem } from '../../services/workitem.service';
import BoardSwimlane from '../BoardSwimlane';

jest.mock('../../contexts/organization-context');
jest.mock('../../services/organization.service');
jest.mock('../../services/workitem.service');

const useOrganizationMock: jest.Mock = useOrganization as any;

describe('BoardSwimlane', () => {
  let updateWorkItemSpy: jest.SpyInstance<
    Promise<WorkItem>,
    [
      orgId: number,
      workItemId: number,
      workItem: Partial<Pick<WorkItem, 'name' | 'status'>>
    ]
  >;
  let getWorkItemSpy: jest.SpyInstance<
    Promise<WorkItem>,
    [orgId: number, itemId: number]
  >;
  let getWorkItemsSpy: jest.SpyInstance<
    Promise<WorkItem[]>,
    [orgId: number, filter?: Partial<Pick<WorkItem, 'type' | 'parentId'>>]
  >;
  let createWorkItemSpy: jest.SpyInstance<
    Promise<WorkItem>,
    [orgId: number, workItem: Pick<WorkItem, 'name'>]
  >;
  let deleteWorkItemSpy: jest.SpyInstance<
    Promise<WorkItem>,
    [orgId: number, workItemId: number]
  >;
  let mockWorkItem: WorkItem;
  let mockStory: WorkItem;

  beforeAll(() => {
    mockWorkItem = {
      id: 1,
      organizationId: 1,
      name: 'test feature',
      priority: 1,
      description: '',
      status: 'BACKLOG',
      type: 'FEATURE',
    };
    mockStory = {
      id: 2,
      organizationId: 1,
      name: 'test story',
      priority: 1,
      description: '',
      status: 'BACKLOG',
      type: 'STORY',
    };
  });

  beforeEach(() => {
    useOrganizationMock.mockReturnValue({
      organization: { id: 1, name: 'testOrg' },
    });

    updateWorkItemSpy = jest.spyOn(WorkitemService, 'updateWorkItem');

    updateWorkItemSpy.mockResolvedValue(mockWorkItem);

    getWorkItemsSpy = jest.spyOn(WorkitemService, 'getWorkItems');

    getWorkItemsSpy.mockResolvedValue([mockWorkItem]);

    createWorkItemSpy = jest.spyOn(WorkitemService, 'createWorkItem');

    createWorkItemSpy.mockResolvedValue(mockWorkItem);

    deleteWorkItemSpy = jest.spyOn(WorkitemService, 'deleteWorkItem');

    deleteWorkItemSpy.mockResolvedValue(mockWorkItem);

    getWorkItemSpy = jest.spyOn(WorkitemService, 'getWorkItem');

    getWorkItemSpy.mockResolvedValue(mockWorkItem);
  });

  test('request work items', async () => {
    render(
      <Accordion>
        <BoardSwimlane key={mockWorkItem.id} parent={mockWorkItem} />
      </Accordion>
    );

    expect(getWorkItemsSpy).toBeCalledWith(1, { parentId: 1 });
  });

  test('edit button renders editable controls', async () => {
    render(
      <Accordion>
        <BoardSwimlane key={mockWorkItem.id} parent={mockWorkItem} />
      </Accordion>
    );

    const button = screen.getByLabelText('Edit');
    fireEvent.click(button);

    expect(screen.getByLabelText('Submit')).toBeVisible();
    expect(screen.getByLabelText('Cancel')).toBeVisible();
  });

  test('editing feature name sends patch work item request', async () => {
    render(
      <Accordion>
        <BoardSwimlane key={mockWorkItem.id} parent={mockWorkItem} />
      </Accordion>
    );

    const button = screen.getByLabelText('Edit');
    fireEvent.click(button);

    const nameInput = screen.getByLabelText('Feature Name');
    fireEvent.change(nameInput, { target: { value: 'new feature name' } });

    const submit = screen.getByLabelText('Submit');
    fireEvent.click(submit);

    expect(updateWorkItemSpy).toBeCalledTimes(2);
  });

  test('notify when work item patch request success', async () => {
    render(
      <Accordion>
        <BoardSwimlane key={mockWorkItem.id} parent={mockWorkItem} />
      </Accordion>
    );

    const button = screen.getByLabelText('Edit');
    fireEvent.click(button);

    const nameInput = screen.getByLabelText('Feature Name');
    fireEvent.change(nameInput, { target: { value: 'new feature name' } });

    const submit = screen.getByLabelText('Submit');
    fireEvent.click(submit);

    expect(updateWorkItemSpy).toHaveBeenCalledWith(
      1,
      1,
      expect.objectContaining({ name: 'new feature name' })
    );

    const items = await screen.findAllByText(
      `Work item name changed to: "new feature name".`
    );
    expect(items.length).toBeGreaterThan(0);
  });

  test('notify when work item patch request fails', async () => {
    updateWorkItemSpy.mockReset();
    updateWorkItemSpy.mockRejectedValueOnce({ errors: ['ErrorMessage'] });

    render(
      <Accordion>
        <BoardSwimlane key={mockWorkItem.id} parent={mockWorkItem} />
      </Accordion>
    );

    const button = screen.getByLabelText('Edit');
    fireEvent.click(button);

    const nameInput = screen.getByLabelText('Feature Name');
    fireEvent.change(nameInput, { target: { value: 'new feature name' } });

    const submit = screen.getByLabelText('Submit');
    fireEvent.click(submit);

    await waitFor(() => {
      expect(
        screen.getByText('Work item modifications failed!')
      ).toBeInTheDocument();

      expect(screen.getByText('ErrorMessage')).toBeInTheDocument();
    });
  });

  test('notify when work item patch request success', async () => {
    getWorkItemsSpy.mockReset();
    getWorkItemsSpy.mockResolvedValue([mockStory]);

    render(
      <Accordion>
        <BoardSwimlane key={mockWorkItem.id} parent={mockWorkItem} />
      </Accordion>
    );

    await waitFor(() => {
      const card = screen.getByText('test story');
      fireEvent.click(card);
    });

    await waitFor(() => {
      const editModal = screen.getByLabelText('Edit Work Item Header');
      expect(editModal).toBeInTheDocument();

      expect(getWorkItemSpy).toBeCalledTimes(1);

      const nameInput = screen.getByPlaceholderText('Name');
      fireEvent.change(nameInput, { target: { value: 'new feature name' } });

      const submit = screen.getByLabelText('Submit Edit');
      fireEvent.click(submit);
    });
  });

  test('delete work item card', async () => {
    getWorkItemsSpy.mockReset();
    getWorkItemsSpy.mockResolvedValue([mockStory]);

    render(
      <Accordion>
        <BoardSwimlane key={mockWorkItem.id} parent={mockWorkItem} />
      </Accordion>
    );

    await waitFor(() => {
      const card = screen.getByText('✖');
      fireEvent.click(card);
    });

    await waitFor(() => {
      expect(deleteWorkItemSpy).toBeCalledTimes(1);
      expect(screen.getByText('Work item successfully deleted.')).toBeInTheDocument();
    });
  });

  test('notify when work item edit window fails', async () => {
    getWorkItemsSpy.mockReset();
    getWorkItemsSpy.mockResolvedValue([mockStory]);

    render(
      <Accordion>
        <BoardSwimlane key={mockWorkItem.id} parent={mockWorkItem} />
      </Accordion>
    );

    getWorkItemSpy.mockReset();
    getWorkItemSpy.mockRejectedValueOnce({errors: ['ErrorMessage']});

    await waitFor(() => {
      const card = screen.getByText('test story');
      fireEvent.click(card);
    });

    const messages = await screen.findAllByText(
      'Work item modifications failed!'
    );

    expect(messages.length).toBeGreaterThan(0);
  });

  test('notify when work item patch request fails with no error messages', async () => {
    updateWorkItemSpy.mockReset();
    updateWorkItemSpy.mockRejectedValueOnce({});

    render(
      <Accordion>
        <BoardSwimlane key={mockWorkItem.id} parent={mockWorkItem} />
      </Accordion>
    );

    const button = screen.getByLabelText('Edit');
    fireEvent.click(button);

    const nameInput = screen.getByLabelText('Feature Name');
    fireEvent.change(nameInput, { target: { value: 'new feature name' } });

    const submit = screen.getByLabelText('Submit');
    fireEvent.click(submit);

    const messages = await screen.findAllByText(
      'Work item modifications failed!'
    );
    expect(messages.length).toBeGreaterThan(0);
  });

  test('moving card to same lane does nothing', async () => {
    const { container } = render(
      <Accordion>
        <BoardSwimlane key={mockWorkItem.id} parent={mockWorkItem} />
      </Accordion>
    );

    const flush = () => new Promise(setImmediate);
    await flush;

    const card = container.getElementsByClassName(
      'smooth-dnd-draggable-wrapper'
    )[0];
    const lanes = container.getElementsByClassName(
      'smooth-dnd-container vertical'
    );

    fireEvent.dragStart(card);
    fireEvent.dragEnter(lanes[1]);
    fireEvent.dragOver(lanes[1]);
    fireEvent.drop(lanes[1], { dataTransfer: { element: card } });

    await waitFor(() => expect(updateWorkItemSpy).toBeCalledTimes(0));
  });

  test('displays add task button when parent is story', () => {
    render(
      <Accordion>
        <BoardSwimlane
          key={mockWorkItem.id}
          parent={{ ...mockWorkItem, type: 'STORY' }}
        />
      </Accordion>
    );

    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });
});
