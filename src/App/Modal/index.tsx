/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactDOM from 'react-dom';

type Props = {
  children: JSX.Element;
  showModal: boolean;
  setShowModal: Function;
};

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
`;

const Container = styled.div`
  border-radius: 0.95rem;
  width: 700px;
  height: 500px;
  margin: 0;
  padding: 0;
  background-color: ${props => props.theme.main};
  color: #666666;
  z-index: 100;
  display: flex;
  flex-direction: column;
`;

const CloseModalButton = styled(FontAwesomeIcon)`
  font-size: 1.6rem;
  color: ${props => props.theme.textColor};
  margin: 1rem;
`;

const CloseModalButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const modalRoot = document.getElementById('modal-root');

const Modal: React.FC<Props> = ({
  children,
  showModal,
  setShowModal,
}: Props) => {
  return modalRoot
    ? ReactDOM.createPortal(
        <>
          {showModal ? (
            <Background>
              <Container>
                <CloseModalButtonWrapper>
                  <CloseModalButton
                    icon="times"
                    fixedWidth
                    onClick={() => setShowModal(!showModal)}
                  />
                </CloseModalButtonWrapper>
                {children}
              </Container>
            </Background>
          ) : null}
        </>,
        modalRoot,
      )
    : null;
};

export default Modal;
