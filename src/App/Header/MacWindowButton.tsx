import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Container = styled.div`
  padding: 10px 10px 10px 10px;
  width: 70px;
  display: flex;
  justify-content: space-between;
`;

const Button = styled.div<{ backgrouncColor: string }>`
  -webkit-app-region: no-drag;
  background-color: ${props => props.backgrouncColor};
  padding: 0;
  margin: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  :hover svg {
    visibility: visible;
  }
`;

const StyledIcon = styled(FontAwesomeIcon)`
  font-size: 8px;
  visibility: hidden;
  color: black;
  opacity: 0.4;
`;

const MacWindowButton: React.FC = () => {
  return (
    <>
      <Container>
        <Button
          onClick={() => window.api.send('closeWindow')}
          backgrouncColor="#fc615d">
          <StyledIcon icon="times" fixedWidth />
        </Button>
        <Button
          onClick={() => window.api.send('minimizeWindow')}
          backgrouncColor="#fdbc40">
          <StyledIcon icon="minus" fixedWidth />
        </Button>
        <Button
          onClick={() => window.api.send('maximizeWindow')}
          backgrouncColor="#34c749">
          <StyledIcon icon="plus" fixedWidth />
        </Button>
      </Container>
    </>
  );
};

export default MacWindowButton;
