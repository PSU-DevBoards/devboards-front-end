// TODO: Remove, temporary to allow stubbing of API
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */

import DbApiService from './dbapi.service';

export type WorkItemType = 'TASK' | 'STORY' | 'FEATURE';

export type WorkItemStatus =
  | 'BACKLOG'
  | 'READY'
  | 'IN_PROGRESS'
  | 'VERIFY'
  | 'DONE';

export type WorkItem = {
  id: number;
  name: string;
  type: 'TASK' | 'STORY' | 'FEATURE';
  status: 'BACKLOG' | 'READY' | 'IN_PROGRESS' | 'VERIFY' | 'DONE';
  priority: number;
  description?: string;
  organizationId: number;
  parentId?: number;
};

class WorkItemService extends DbApiService {
  public async getWorkItems(
    orgId: number,
    filter?: Partial<Pick<WorkItem, 'type' | 'parentId'>>
  ): Promise<Array<WorkItem>> {
    return this.get(`/organizations/${orgId}/work-items`);
  }

  public async updateWorkItem(
    orgId: number,
    workItemId: number,
    workItem: Pick<WorkItem, 'name'>
  ): Promise<WorkItem> {
    return this.patch(`/organizations/${orgId}/work-items/${workItemId}`, workItem);
  }
  /*
  public async listWorkItems(
    orgId: number,
    filter?: Partial<Pick<WorkItem, 'type' | 'parent_id'>>
  ): Promise<Array<WorkItem>> {
    return Promise.resolve([
      {
        id: 1,
        name: 'Test Feature',
        type: 'FEATURE',
        status: 'READY',
        priority: 1,
        description: 'Test',
        organization_id: 1,
      },
      {
        id: 5,
        name: 'Test Feature 2',
        type: 'FEATURE',
        status: 'READY',
        priority: 1,
        description: 'Test',
        organization_id: 1,
      },
    ]);
  }
  */
}

export default new WorkItemService();
