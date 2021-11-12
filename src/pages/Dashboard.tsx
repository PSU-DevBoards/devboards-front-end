import {
  Button,
  Flex,
  Container,
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  Text,
  AccordionIcon,
  AccordionPanel,
  ButtonGroup,
  IconButton,
  Editable,
  EditablePreview,
  EditableInput,
  useEditableControls
} from '@chakra-ui/react';
import { BiPlus, BiCheck, BiX, BiEdit } from "react-icons/bi";
import React, { useEffect, useState } from 'react';
import Board from 'react-trello';
import NoOrganization from '../components/NoOrganization';
import organizationService, {
  Organization,
} from '../services/organization.service';

function Dashboard() {
  const [organizations, setOrganizations] = useState<Array<Organization>>(
    []
  );

  /* For Testing Only */
  const data = {
    lanes: [
      {
        id: 'lane1',
        title: 'Backlog',
        label: '2/2',
        cards: [
          {id: 'Card2', title: 'Super Easy Task', description: 'As a {blah} I want to be able to {blah}', label: ''}
        ]
      },
      {
        id: 'lane2',
        title: 'Ready',
        label: '0/0',
        cards: [],
      },
      {
        id: 'lane3',
        title: 'In-Progress',
        label: '0/0',
        cards: [],
      },
      {
        id: 'lane4',
        title: 'Verify',
        label: '0/0',
        cards: [],
      },
      {
        id: 'lane5',
        title: 'Done',
        label: '0/0',
        cards: [],
      },
    ]
  }

  useEffect(() => {
    organizationService.getCurrentUserOrganizations().then(setOrganizations);
  }, []);

  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls()

    return isEditing ? (
      <ButtonGroup size="xs">
        <IconButton aria-label="Submit changes" icon={<BiCheck />} {...getSubmitButtonProps()} />
        <IconButton aria-label="Cancel changes" icon={<BiX />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
        <IconButton marginLeft="10px" aria-label="Edit feature name" size="xs" icon={<BiEdit />} {...getEditButtonProps()} />
    )
  }

  return (
    <>
      {organizations?.length > 0 ? (
        <>
        <Container maxW="">
          <Accordion defaultIndex={[0]} allowMultiple>
            <AccordionItem>
              <h2>
                <AccordionButton as="div">
                  <Box flex="1" textAlign="left">
                    <Flex flexDirection="row" alignItems="baseline">
                      <Text
                        fontWeight="500"
                        fontSize="lg"
                        marginRight="5px"
                        isTruncated>F-123456:
                      </Text>
                      <Editable
                        fontWeight="400"
                        fontSize="lg"
                        defaultValue="Super Cool Feature Name"
                        isPreviewFocusable={false}
                        onClick={e => {e.stopPropagation();}}>
                          <EditablePreview/>
                          <EditableInput/>
                          <EditableControls />
                      </Editable>
                    </Flex>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                  <Board style={{backgroundColor: 'white', height: 'auto'}} data={data} />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          <Flex flexDirection="row-reverse" pt={25}>
            <ButtonGroup size="md" isAttached variant="outline">
              <Button mr="-px">Add Feature</Button>
              <IconButton aria-label="Add Feature" icon={<BiPlus />} />
            </ButtonGroup>
          </Flex>
        </Container>
        </>
      ) : (
        <NoOrganization />
      )}
    </>
  );
}

export default Dashboard;
