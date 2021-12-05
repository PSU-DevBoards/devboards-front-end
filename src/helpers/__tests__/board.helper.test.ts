import buildBoardData from '../board.helper';

describe('Board Helper', () => {
  it('provides a priority and estimate label when both present', () => {
    const data = buildBoardData([
      {
        id: 1,
        estimate: 1,
        priority: 1,
        name: 'test',
        type: 'STORY',
        status: 'BACKLOG',
        organizationId: 1,
      },
    ]);

    expect(data.lanes.find((ln) => ln.id === 'BACKLOG').cards[0]).toEqual(
      expect.objectContaining({ label: 'Est: 1, Priority: 1' })
    );
  });
});
