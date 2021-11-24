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
  let getWorkItemsSpy: jest.SpyInstance<
    Promise<WorkItem[]>,
    [orgId: number, filter?: Partial<Pick<WorkItem, 'type' | 'parentId'>>]
  >;
  let mockWorkItem: WorkItem;

  beforeAll(() => {
    mockWorkItem = {
      id: 1,
      organizationId: 1,
      name: 'test feature',
      priority: 1,
      description: '',
      status: 'IN_PROGRESS',
      type: 'FEATURE',
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
      `Feature name changed to: "new feature name".`
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
        screen.getByText('Feature modifications failed!')
      ).toBeInTheDocument();

      expect(screen.getByText('ErrorMessage')).toBeInTheDocument();
    });
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

    await waitFor(() => {
      expect(
        screen.getByText('Feature modifications failed!')
      ).toBeInTheDocument();
    });
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
});
