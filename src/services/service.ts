import { getAuthenticationHeader } from '../helpers/auth.helper';

/* Base service for common HTTP fetch requests */
class Service {
  protected baseUrl: string = '';

  /**
    * HTTP GET request
  */
  protected async get(endpoint: string, params?: Record<string, any>) {
    const url =
      this.baseUrl +
      endpoint +
      (params ? `?${new URLSearchParams(params)}` : '');

    /* Insert authorization header */
    const response = await fetch(url, {
      headers: getAuthenticationHeader(),
    });

    return this.processResponse(response);
  }

  /**
    * HTTP POST request
  */
  protected async post(endpoint: string, body: any) {
    const response = await fetch(this.baseUrl + endpoint, {
      headers: {
        ...getAuthenticationHeader(),
        ...{ 'Content-Type': 'application/json' },
      },
      method: 'POST',
      body: JSON.stringify(body),
    });

    return this.processResponse(response);
  }

  /**
    * HTTP PATCH request
  */
  protected async patch(endpoint: string, body: any) {
    const response = await fetch(this.baseUrl + endpoint, {
      headers: {
        ...getAuthenticationHeader(),
        ...{ 'Content-Type': 'application/json' },
      },
      method: 'PATCH',
      body: JSON.stringify(body),
    });

    return this.processResponse(response);
  }

  /**
    * HTTP DELETE request
  */
  protected async delete(endpoint: string) {
    const response = await fetch(this.baseUrl + endpoint, {
      headers: {
        ...getAuthenticationHeader(),
      },
      method: 'DELETE',
    });

    return this.processResponse(response);
  }

  // eslint-disable-next-line class-methods-use-this
  private processResponse(response: Response) {
    /* Only attempt parsing as JSON when response is guaranteed to contain JSON */
    const body =
      response.headers.get('Content-Type') === 'application/json'
        ? response.json()
        : response.text();

    return response.ok ? body : Promise.reject(response);
  }
}

export default Service;
