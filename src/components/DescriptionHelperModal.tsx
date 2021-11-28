import {
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';

const GWTForm = ({ onSubmit }: { onSubmit: (text: string) => void }) => {
  const { handleSubmit, handleChange, values, submitForm } = useFormik({
    initialValues: {
      given: 'some context',
      when: 'some action is carried out',
      then: 'a particular set of observable consequences should obtain',
    },
    onSubmit: ({ given, when, then }) =>
      onSubmit(`Given ${given} when ${when} then ${then}`),
  });

  useEffect(() => {
    submitForm();
  }, [values]);

  return (
    <form onSubmit={handleSubmit}>
      <VStack>
        <InputGroup>
          <InputLeftAddon>Given</InputLeftAddon>
          <Input
            id="given"
            name="given"
            type="text"
            aria-label="given"
            onChange={handleChange}
            value={values.given}
          />
        </InputGroup>
        <InputGroup>
          <InputLeftAddon>When</InputLeftAddon>
          <Input
            id="when"
            name="when"
            type="text"
            aria-label="when"
            onChange={handleChange}
            value={values.when}
          />
        </InputGroup>
        <InputGroup>
          <InputLeftAddon>Then</InputLeftAddon>
          <Input
            id="then"
            name="then"
            type="text"
            aria-label="then"
            onChange={handleChange}
            value={values.then}
          />
        </InputGroup>
      </VStack>
    </form>
  );
};

const RFBForm = ({ onSubmit }: { onSubmit: (text: string) => void }) => {
  const { handleSubmit, handleChange, values, submitForm } = useFormik({
    initialValues: {
      role: 'user',
      feature: 'do a thing',
      benifit: 'I can accomplish my goal!',
    },
    onSubmit: ({ role, feature, benifit }) =>
      onSubmit(`As a ${role} I want to ${feature} so that ${benifit}`),
  });

  useEffect(() => {
    submitForm();
  }, [values]);

  return (
    <form onSubmit={handleSubmit}>
      <VStack>
        <InputGroup>
          <InputLeftAddon>As a</InputLeftAddon>
          <Input
            id="role"
            name="role"
            type="text"
            aria-label="role"
            onChange={handleChange}
            value={values.role}
          />
        </InputGroup>
        <InputGroup>
          <InputLeftAddon>I want to</InputLeftAddon>
          <Input
            id="feature"
            name="feature"
            type="text"
            aria-label="feature"
            onChange={handleChange}
            value={values.feature}
          />
        </InputGroup>
        <InputGroup>
          <InputLeftAddon>So that</InputLeftAddon>
          <Input
            id="benifit"
            name="benifit"
            type="text"
            aria-label="benifit"
            onChange={handleChange}
            value={values.benifit}
          />
        </InputGroup>
      </VStack>
    </form>
  );
};

function DescriptionHelperModal({
  template,
  onSubmit,
  isOpen,
  onClose,
}: {
  template: 'RFB' | 'GWT';
  onSubmit: (text: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [description, setDescription] = useState('');

  const onClickSubmit = () => {
    onSubmit(description);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Description Helper</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {template === 'GWT' ? (
            <GWTForm onSubmit={setDescription} />
          ) : (
            <RFBForm onSubmit={setDescription} />
          )}
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme="purple"
            onClick={onClickSubmit}
            aria-label="submit description"
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DescriptionHelperModal;
