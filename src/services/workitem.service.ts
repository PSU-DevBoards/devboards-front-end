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
  estimate?: number;
  description?: string;
  organizationId: number;
  parentId?: number;
};

class WorkItemService extends DbApiService {
  public async getWorkItem(orgId: number, itemId: number): Promise<WorkItem> {
    return this.get(`/organizations/${orgId}/work-items/${itemId}`);
  }

  public async getWorkItems(
    orgId: number,
    filter?: Partial<Pick<WorkItem, 'type' | 'parentId'>>
  ): Promise<Array<WorkItem>> {
    return this.get(`/organizations/${orgId}/work-items`, filter);
  }

  public async updateWorkItem(
    orgId: number,
    workItemId: number,
    workItem: Partial<
      Pick<
        WorkItem,
        'name' | 'status' | 'priority' | 'description' | 'estimate'
      >
    >
  ): Promise<WorkItem> {
    return this.patch(
      `/organizations/${orgId}/work-items/${workItemId}`,
      workItem
    );
  }

  public async deleteWorkItem(
    orgId: number,
    workItemId: number
  ): Promise<WorkItem> {
    return this.delete(`/organizations/${orgId}/work-items/${workItemId}`);
  }

  public async createWorkItem(
    orgId: number,
    workItem: Pick<WorkItem, 'name'>
  ): Promise<WorkItem> {
    return this.post(`/organizations/${orgId}/work-items/`, workItem);
  }
}

export default new WorkItemService();
