import Service from '../service';

describe('service', () => {
  const response = { message: 'bad' };

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(response),
      } as any)
    );
  });

  test('get rejects on request failure', () => {
    const service = new Service() as any;

    expect(service.get('/')).rejects.toEqual(response);
  });

  test('post rejects on request failure', () => {
    const service = new Service() as any;

    expect(service.post('/')).rejects.toEqual(response);
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockRestore();
  });
});