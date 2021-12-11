import DbApiService from './dbapi.service';

/* Primary object for role request responses */
export type Role = {
  id: number;
  name: string;
};

/* Role service for sending role-related CRUD requests to API */
class RoleService extends DbApiService {

  /**
   * Gets all possible user roles.
   * @returns An array of Role objects containing all possible user roles.
   */
  public async listRoles(): Promise<Array<Role>> {
    return this.get('/roles');
  }
}

export default new RoleService();
