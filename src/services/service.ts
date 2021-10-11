import { getAuthenticationHeader } from '../helpers/auth.helper';

class Service {
  protected baseUrl: string = '';

  protected async get(endpoint: string) {
    const res = await fetch(this.baseUrl + endpoint, {
      headers: getAuthenticationHeader(),
    });

    const json = await res.json();

    return json;
  }
}

export default Service;
