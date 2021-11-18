import { WorkItem } from '../services/workitem.service';

const BASE_BOARD_DATA: ReactTrello.BoardData = {
  lanes: [
    {
      id: 'lane1',
      title: 'Backlog',
      label: '2/2',
      status: 'BACKLOG',
      cards: [],
    },
    {
      id: 'lane2',
      title: 'Ready',
      label: '0/0',
      status: 'READY',
      cards: [],
    },
    {
      id: 'lane3',
      title: 'In-Progress',
      label: '0/0',
      status: 'IN_PROGRESS',
      cards: [],
    },
    {
      id: 'lane4',
      title: 'Verify',
      label: '0/0',
      status: 'VERIFY',
      cards: [],
    },
    {
      id: 'lane5',
      title: 'Done',
      label: '0/0',
      status: 'DONE',
      cards: [],
    },
  ],
};

const workItemToCard = (workItem: WorkItem) => ({
  id: workItem.id,
  title: workItem.name,
  description: workItem.description,
  label: '',
});

const buildBoardData = (workItems: Array<WorkItem>) => ({
  lanes: BASE_BOARD_DATA.lanes.map((lane) => ({
    ...lane,
    cards: workItems
      .filter((workItem) => workItem.status === lane.status)
      .map(workItemToCard),
    label: `${workItems.filter((workItem) => workItem.status === lane.status).length}`,
  })),
});

export default buildBoardData;
