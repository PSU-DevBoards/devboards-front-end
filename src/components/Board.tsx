import {
  Accordion,
  Button,
  ButtonGroup,
  Container,
  Flex,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import BoardSwimlane from './BoardSwimlane';
import EditWorkItemModal from './EditWorkItemModal';
import WorkitemService, {
  WorkItem,
  WorkItemType,
} from '../services/workitem.service';
import { useOrganization } from '../contexts/organization-context';

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
    if (organization)
      WorkitemService.listWorkItems(organization.id, {
        type: parentView as WorkItemType,
      }).then(setWorkItems);
  }, [organization]);

  return (
    <Container maxW="">
      <Accordion defaultIndex={[0]} allowMultiple>
        {workItems.map((workItem) => (
          <BoardSwimlane key={workItem.id} parent={workItem} />
        ))}
      </Accordion>
      <Flex flexDirection="row-reverse" pt={25}>
        <ButtonGroup size="md" isAttached variant="outline">
          <Button mr="-px" onClick={onOpenEditItem}>
            New {parentView}
          </Button>
          <IconButton aria-label="Add Feature" icon={<BiPlus />} />
        </ButtonGroup>
      </Flex>
      <EditWorkItemModal
        workItemType="FEATURE"
        isOpen={isEditItemOpen}
        onClose={onCloseEditItem}
      />
    </Container>
  );
}

export default Board;
