import DbApiService from './dbapi.service';
import { User } from './user.service';

export type Organization = {
  id: number;
  name: string;
  owner: User;
};

export type OrganizationUser = {
  organization_id: number;
  user_id: number;
  role_id: string;
};

class OrganizationService extends DbApiService {
  public async getOrganizationById(id: number): Promise<Organization> {
    return this.get(`/organizations/${id}`);
  }

  public async getOrganizationUsers(
    id: number
  ): Promise<Array<OrganizationUser>> {
    return this.get(`/organizations/${id}/users`);
  }

  public async createOrganization(name: string): Promise<Organization> {
    return this.post(`/organizations`, { name });
  }
}

export default new OrganizationService();
