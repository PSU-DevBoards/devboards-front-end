import { getAuthenticationHeader } from '../helpers/auth.helper';

class Service {
  protected baseUrl: string = '';

  protected async get(endpoint: string) {
    const res = await fetch(this.baseUrl + endpoint, {
      headers: getAuthenticationHeader(),
    });

    /* if response OK (HTTP 2XX) return result -- otherwise reject promise so exception is invoked */
    const json = await res.json();
    return res.ok ? json : json.then(Promise.reject.bind(Promise));
  }

  protected async post(endpoint: string, body: any) {

    const res = await fetch(this.baseUrl + endpoint, {
      headers: {...getAuthenticationHeader(), ...{ "Content-Type": "application/json" }},
      method: 'POST',
      body: JSON.stringify(body),      
    })

    /* if response OK (HTTP 2XX) return result -- otherwise reject promise so exception is invoked */
    const json = await res.json();
    return res.ok ? json : json.then(Promise.reject.bind(Promise));
  }
}

export default Service;
