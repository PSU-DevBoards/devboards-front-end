import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { OrganizationProvider } from '../../contexts/organization-context';
import OrganizationBoard from '../OrganizationBoard';

describe('<OrganizationBoard/>', () => {
  it('renders', () => {
    render(
      <BrowserRouter>
        <OrganizationProvider>
          <OrganizationBoard />
        </OrganizationProvider>
      </BrowserRouter>
    );
  });
});
