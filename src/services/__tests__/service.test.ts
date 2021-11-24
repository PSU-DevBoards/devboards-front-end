import Service from '../service';

describe('service', () => {
  const service = new Service() as any;
  const response = { message: 'bad' };

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve(response),
      } as any)
    );
  });

  test('returns response text if Json is not present', () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        headers: { get: () => 'application/text' },
        text: () => 'text',
      } as any)
    );

    expect(service.get('/')).resolves.toEqual('text');
  });

  test('get adds query params', () => {
    service.get('/', { test: 1 });

    expect(global.fetch).toHaveBeenCalledWith('/?test=1', expect.anything());
  });

  test('get rejects on request failure', () => {
    expect(service.get('/')).rejects.toEqual(response);
  });

  test('patch rejects on request failure', () => {
    expect(service.patch('/')).rejects.toEqual(response);
  });

  test('post rejects on request failure', () => {
    expect(service.post('/')).rejects.toEqual(response);
  });

  test('delete rejects on a failure', () => {
    expect(service.delete('/')).rejects.toEqual(response);
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockRestore();
  });
});
