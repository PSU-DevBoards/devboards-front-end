import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  test('renders', () => {
    render(<App />);
    const container = screen.getByTestId('app_container');
    expect(container).toBeInTheDocument();
  });
});
