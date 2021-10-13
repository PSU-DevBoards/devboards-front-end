import { getAuthenticationHeader } from '../helpers/auth.helper';

class Service {
  protected baseUrl: string = '';

  protected async get(endpoint: string) {
    const res = await fetch(this.baseUrl + endpoint, {
      headers: getAuthenticationHeader(),
    });

    const json = await res.json();
    json.status = res.status;

    return json;
  }

  protected async post(endpoint: string, body: any) {

    const res = await fetch(this.baseUrl + endpoint, {
      headers: {...getAuthenticationHeader(), ...{ "Content-Type": "application/json" }},
      method: 'POST',
      body: JSON.stringify(body),
    });

    const json = await res.json();
    json.status = res.status;

    return json;
  }
}

export default Service;
