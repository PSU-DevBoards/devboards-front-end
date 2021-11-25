import DbApiService from './dbapi.service';

export type Role = {
  id: number;
  name: string;
};

class RoleService extends DbApiService {
  public async listRoles(): Promise<Array<Role>> {
    return this.get('/roles');
  }
}

export default new RoleService();
