import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import NotFound from '../NotFound';

describe('<NotFound/>', () => {
  it('renders without error', () => {
    render(
      <Router>
        <NotFound />
      </Router>
    );
  });
});
