import DbApiService from './dbapi.service';

export type User = {
  id: number;
  username: string;
};

class UserService extends DbApiService {
  public async getCurrentUser(): Promise<User> {
    return this.get(`/users/me`);
  }
}

export default new UserService();
