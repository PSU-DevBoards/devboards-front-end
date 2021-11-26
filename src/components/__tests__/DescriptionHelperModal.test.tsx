import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DescriptionHelperModal from '../DescriptionHelperModal';

const onSubmit = jest.fn();
const onClose = jest.fn();

let submitButton: HTMLElement;

const setup = (template: 'RFB' | 'GWT') => {
  render(
    <DescriptionHelperModal
      template={template}
      onSubmit={onSubmit}
      isOpen
      onClose={onClose}
    />
  );

  submitButton = screen.getByLabelText('submit description');
};

describe('<DescriptionHelperModal/>', () => {
  it('renders and submits a role feature benifit template', async () => {
    setup('RFB');

    const roleInput = screen.getByLabelText('role');
    fireEvent.change(roleInput, { target: { value: 'role' } });

    const featureInput = screen.getByLabelText('feature');
    fireEvent.change(featureInput, { target: { value: 'feature' } });

    const benifitInput = screen.getByLabelText('benifit');
    fireEvent.change(benifitInput, { target: { value: 'benifit' } });

    await waitFor(() =>
      expect(screen.getByDisplayValue('benifit')).toBeInTheDocument()
    );

    fireEvent.click(submitButton);

    expect(onSubmit).toBeCalledWith(
      'As a role I want to feature so that benifit'
    );
  });

  it('renders and submits a given when then template', async () => {
    setup('GWT');

    const givenInput = screen.getByLabelText('given');
    fireEvent.change(givenInput, { target: { value: 'given' } });

    const whenInput = screen.getByLabelText('when');
    fireEvent.change(whenInput, { target: { value: 'when' } });

    const thenInput = screen.getByLabelText('then');
    fireEvent.change(thenInput, { target: { value: 'then' } });

    await waitFor(() =>
      expect(screen.getByDisplayValue('then')).toBeInTheDocument()
    );

    fireEvent.click(submitButton);

    expect(onSubmit).toBeCalledWith('Given given when when then then');
  });

  afterEach(() => {
    onSubmit.mockClear();
    onClose.mockClear();
  });
});
