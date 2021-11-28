import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import BoardMenu from '../BoardMenu';

const Container = () => {
  const [parentView, setParentView] = useState<'FEATURE' | 'STORY'>('FEATURE');

  return (
    <>
      <p>PV:{parentView}</p>
      <BoardMenu parentView={parentView} onSelectView={setParentView} />
    </>
  );
};

describe('<BoardMenu/>', () => {
  it('signals switch between views', () => {
    render(<Container />);

    expect(screen.getByText('PV:FEATURE')).toBeInTheDocument();

    const storyViewButton = screen.getByText('Task Board');
    fireEvent.click(storyViewButton);

    expect(screen.getByText('PV:STORY')).toBeInTheDocument();

    const featureViewButton = screen.getByText('Story Board');
    fireEvent.click(featureViewButton);

    expect(screen.getByText('PV:FEATURE')).toBeInTheDocument();
  });
});
