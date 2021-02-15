import React from 'react';
import styled from 'styled-components';
import MacWindowButton from './MacWindowButton';

const StyledHeader = styled.header`
  -webkit-app-region: drag;
  width: 100%;
  height: 70px;
`;

const Header: React.FC = () => {
  return (
    <StyledHeader>
      <MacWindowButton />
    </StyledHeader>
  );
};

export default Header;
