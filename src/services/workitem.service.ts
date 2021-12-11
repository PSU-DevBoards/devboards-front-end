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

/* Work item service for sending work-item related CRUD requests to API */
class WorkItemService extends DbApiService {
  /**
   * Gets work item given the item's identifier.
   * @param ID Organization ID.
   * @param ItemID Work item ID.
   * @returns The requested WorkItem object.
   */
  public async getWorkItem(orgId: number, itemId: number): Promise<WorkItem> {
    return this.get(`/organizations/${orgId}/work-items/${itemId}`);
  }

  /**
   * Updates work item details.
   * @param ID Organization ID.
   * @param filter Optional filter to only return work items that match specific attributes.
   * @returns An array of WorkItem objects.
   */
  public async getWorkItems(
    orgId: number,
    filter?: Partial<Pick<WorkItem, 'type' | 'parentId'>>
  ): Promise<Array<WorkItem>> {
    return this.get(`/organizations/${orgId}/work-items`, filter);
  }

  /**
   * Updates work item details.
   * @param ID Organization ID.
   * @param workItemId Work item identifier.
   * @param Values A single or set of work item attributes to be updated.
   * @returns A WorkItem object which reflects the requested changes.
   */
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

  /**
   * Deletes work item.
   * @param ID Organization ID.
   * @param workItemId Work item identifier.
   */
  public async deleteWorkItem(
    orgId: number,
    workItemId: number
  ): Promise<WorkItem> {
    return this.delete(`/organizations/${orgId}/work-items/${workItemId}`);
  }

  /**
   * Creates work item.
   * @param ID Organization ID.
   * @param Values A single or set of work item attributes.
   * @returns The resulting WorkItem object.
   */
  public async createWorkItem(
    orgId: number,
    workItem: Pick<WorkItem, 'name'>
  ): Promise<WorkItem> {
    return this.post(`/organizations/${orgId}/work-items/`, workItem);
  }
}

export default new WorkItemService();
