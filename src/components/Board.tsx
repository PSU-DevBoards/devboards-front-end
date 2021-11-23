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
import BoardSwimlane from './BoardSwimlane';
import EditWorkItemModal from './EditWorkItemModal';

function Board() {
  const { organization } = useOrganization();
  const [parentView] = useState<'FEATURE' | 'STORY'>('FEATURE');
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
  }, [organization]);

  const onWorkItemSaved = (workItem: WorkItem) => {
    const index = workItems.findIndex((item) => item.id === workItem.id);
    const items = workItems;

    if (index !== -1) {
      items[index] = workItem;
    } else {
      items.push(workItem);
    }

    setWorkItems(items);
  };

  return (
    <Container maxW="">
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
