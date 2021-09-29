import React from 'react';
import { Flex, Heading, Divider } from '@chakra-ui/react';

const header = "DevBoards";

const Header = () => (
    <div>
        {/* Align header to start of page */}
        <Flex alignItems='start' >
            <Heading fontWeight='light' size='4xl' >{ header }</Heading>
        </Flex>
        
        {/* Header & description divider */}
        <Divider my={3}/>
    </div>
);

export default Header;