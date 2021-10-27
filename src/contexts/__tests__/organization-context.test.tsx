import { render, screen, waitFor } from '@testing-library/react';
import { useParams } from 'react-router';
import { OrganizationProvider, useOrganization } from '../organization-context';
import OrganizationService, {
  Organization,
} from '../../services/organization.service';

jest.mock('react-router');
jest.mock('../../services/organization.service');

const mockUseParams = useParams as jest.Mock;

const OrganizationConsumer = () => {
  const { organization } = useOrganization();

  return <p>{organization?.name}</p>;
};

describe('Organization Context', () => {
  let getOrgSpy: jest.SpyInstance<Promise<Organization>, [id: number]>;

  beforeEach(() => {
    mockUseParams.mockReturnValue({ orgId: '1' });

    getOrgSpy = jest.spyOn(OrganizationService, 'getOrganizationById');
  });

  test('gets the organization based on the path param', () => {
    render(
      <OrganizationProvider>
        <p>TEST</p>
      </OrganizationProvider>
    );

    expect(getOrgSpy).toBeCalledWith(1);
  });

  test('makes the organization context available to a consumer', async () => {
    getOrgSpy.mockResolvedValue({ name: 'Test' } as any);

    render(
      <OrganizationProvider>
        <OrganizationConsumer />
      </OrganizationProvider>
    );

    await waitFor(() => expect(screen.getByText('Test')).toBeInTheDocument());
  });

  test('throws when not in a provider', async () => {
    await waitFor(() =>
      expect(() => render(<OrganizationConsumer />)).toThrow()
    );
  });

  afterEach(() => {
    mockUseParams.mockRestore();
    getOrgSpy.mockRestore();
  });
});
