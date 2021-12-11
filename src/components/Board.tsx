import {
  Accordion,
  Button,
  Container,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import { useOrganization } from '../contexts/organization-context';
import WorkitemService, {
  WorkItem,
  WorkItemType,
} from '../services/workitem.service';
import BoardMenu from './BoardMenu';
import BoardSwimlane from './BoardSwimlane';
import EditWorkItemModal from './EditWorkItemModal';

function Board() {
  /* Provide board with context of the user's organization */
  const { organization } = useOrganization();
  const [parentView, setParentView] = useState<'FEATURE' | 'STORY'>('FEATURE');
  const [workItems, setWorkItems] = useState<Array<WorkItem>>([]);
  const {
    isOpen: isEditItemOpen,
    onOpen: onOpenEditItem,
    onClose: onCloseEditItem,
  } = useDisclosure();

  useEffect(() => {
    if (organization) {
      WorkitemService.getWorkItems(organization.id, {
        type: parentView as WorkItemType,
      }).then(setWorkItems);
    }
  }, [organization, parentView]);

  /* Update state variable when work item saved to reflect changes on board */
  const onWorkItemSaved = (workItem: WorkItem) => {
    setWorkItems([...workItems, workItem]);
  };

  return (
    <Container maxW="">
      <BoardMenu parentView={parentView} onSelectView={setParentView} />
      { /* Create swimplanes for each work item type */ }
      <Accordion defaultIndex={[0]} allowMultiple>
        {workItems.map((workItem) => (
          <BoardSwimlane key={workItem.id} parent={workItem} />
        ))}
      </Accordion>
      <Flex flexDirection="row-reverse" pt={25}>
        <Button
          variant="outline"
          onClick={onOpenEditItem}
          rightIcon={<BiPlus />}
          aria-label="New Workitem"
        >
          New {parentView.charAt(0) + parentView.slice(1).toLowerCase()}
        </Button>
      </Flex>
      <EditWorkItemModal
        workItemType="FEATURE"
        isOpen={isEditItemOpen}
        onWorkItemSaved={onWorkItemSaved}
        onClose={onCloseEditItem}
      />
    </Container>
  );
}

export default Board;
