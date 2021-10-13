import { getAuthenticationHeader } from '../helpers/auth.helper';

class Service {
  protected baseUrl: string = '';

  protected async get(endpoint: string) {
    const res = await fetch(this.baseUrl + endpoint, {
      headers: getAuthenticationHeader(),
    });

    let json = {
      result: {},
      response: {}
    };
    json.result = res;
    json.response = await res.json();
    
    return json;
  }

  protected async post(endpoint: string, body: any) {

    const res = await fetch(this.baseUrl + endpoint, {
      headers: {...getAuthenticationHeader(), ...{ "Content-Type": "application/json" }},
      method: 'POST',
      body: JSON.stringify(body),
    });

    let json = {
      result: {},
      response: {}
    };
    json.result = res;
    json.response = await res.json();

    return json;
  }
}

export default Service;
