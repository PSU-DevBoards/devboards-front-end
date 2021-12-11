import { Button, HStack } from '@chakra-ui/react';
import React from 'react';

/* Top menu for switching between task and story views */
function BoardMenu({
  parentView,
  onSelectView,
}: {
  parentView: 'FEATURE' | 'STORY';
  onSelectView: (view: 'FEATURE' | 'STORY') => void;
}) {
  return (
    <HStack pb={4}>
      <Button
        colorScheme={parentView === 'FEATURE' ? 'purple' : 'gray'}
        onClick={() => onSelectView('FEATURE')}
      >
        Story Board
      </Button>
      <Button
        colorScheme={parentView === 'STORY' ? 'purple' : 'gray'}
        onClick={() => onSelectView('STORY')}
      >
        Task Board
      </Button>
    </HStack>
  );
}

export default BoardMenu;
