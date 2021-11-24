import WorkItemService, { WorkItem, WorkItemType } from '../workitem.service';

describe('workItemService', () => {
  let workItems = [] as any;

  beforeAll(() => {
    workItems = [
      {
        id: 0,
        name: "testWorkItem",
        type: "STORY",
        status: "BACKLOG",
        priority: 1,
        description: null,
        organizationId: 1,
        parentId: null
      },
    ];
  });

  it('gets the current organization work items', async () => {
    const requestHeader: HeadersInit = new Headers();
    requestHeader.set('Content-Type', 'application/json');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        headers: requestHeader,
        json: () => Promise.resolve(workItems),
      } as any)
    );
    
    const currentWorkItems =
      await WorkItemService.getWorkItems(1);
    
    expect(currentWorkItems).toEqual(workItems);
    expect(global.fetch).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { Authorization: expect.any(String) },
      })
    );
  });
    
  it('updates work item', async () => {
    const workItem = workItems[0];
    workItem.name = 'newWorkItemName';
    const requestHeader: HeadersInit = new Headers();
    requestHeader.set('Content-Type', 'application/json');
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        headers: requestHeader,
        json: () => Promise.resolve(workItem),
      } as any)
    );

    const newWorkItem = await WorkItemService.updateWorkItem(1, 1, {
      name: workItem.name,
    });
    
    expect(newWorkItem).toEqual(workItem);
    expect(global.fetch).toBeCalledWith(
      expect.stringContaining('/organizations/1/work-items/1'),
      expect.objectContaining({
        method: 'PATCH',
        headers: {
          Authorization: expect.any(String),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: workItem.name,
        }),
      })
    );
  });

  it('create work item', async () => {
    const workItem = workItems[0];
    const requestHeader: HeadersInit = new Headers();
    requestHeader.set('Content-Type', 'application/json');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        headers: requestHeader,
        json: () => Promise.resolve(workItem),
      } as any)
    );

    const newWorkItem = await WorkItemService.createWorkItem(1, {
      name: workItem.name,
      type: ("STORY" as WorkItemType),
      status: "BACKLOG",
      priority: 1
    } as WorkItem);

    expect(newWorkItem).toEqual(workItem);
    expect(global.fetch).toBeCalledWith(
      expect.stringContaining('/organizations/1/work-items'),
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: expect.any(String),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: workItem.name,
          type: "STORY",
          status: "BACKLOG",
          priority: 1
        }),
      })
    );
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockRestore();
  });
});
