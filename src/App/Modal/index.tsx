/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import styled from 'styled-components';
import ReactDOM from 'react-dom';

const Background = styled.div`
  background: rgba(238, 240, 244, 0.9);
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
`;

const Container = styled.div`
  border-radius: 0.95rem;
  margin: 0;
  padding: 0;
  background-color: ${props => props.theme.main};
  box-shadow: 4px 3px 9px ${props => props.theme.shadow},
    -4px -3px 9px ${props => props.theme.light};
  z-index: 100;
  display: flex;
  flex-direction: column;
`;

type Props = {
  children: JSX.Element;
  showModal: boolean;
};

const modalRoot = document.getElementById('modal-root');

const Modal: React.FC<Props> = ({ children, showModal }) => {
  return modalRoot
    ? ReactDOM.createPortal(
        <>
          {showModal ? (
            <Background>
              <Container>{children}</Container>
            </Background>
          ) : null}
        </>,
        modalRoot,
      )
    : null;
};

export default Modal;
