import React, { useState } from 'react';
import { RootState } from '../../reducers';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Modal from '../Modal';
import Button from '../../shared/Button';
import AddTaskForm from './AddTaskForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../electron/api.interface';

const Container = styled.div`
  margin: 0 70px;
  display: flex;
  justify-content: space-between;
`;

const Title = styled.h1`
  color: ${props => props.theme.textColor};
  font-size: 2rem;
  font-weight: 300;
  margin: 0;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ExtendedButton = styled(Button)`
  margin-left: 2rem;
`;

const StyledIcon = styled(FontAwesomeIcon)`
  font-size: 1.4rem;
`;

const TaskAction: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { tasks } = useSelector((state: RootState) => state.tasks);
  return (
    <>
      <Modal showModal={showModal}>
        <AddTaskForm setShowModal={setShowModal} />
      </Modal>

      <Container>
        <Title>Tasks</Title>
        <ButtonWrapper>
          <ExtendedButton onClick={() => setShowModal(!showModal)}>
            <StyledIcon icon="plus" fixedWidth /> Add Task
          </ExtendedButton>
          <ExtendedButton onClick={() => window.api.send('startAll', tasks)}>
            <StyledIcon icon="play" fixedWidth /> Start All
          </ExtendedButton>
          <ExtendedButton onClick={() => window.api.send('stopAll')}>
            <StyledIcon icon="stop" fixedWidth /> Stop All
          </ExtendedButton>
          <ExtendedButton onClick={() => window.api.send('exportTask', tasks)}>
            <StyledIcon icon="pencil-alt" fixedWidth /> Export
          </ExtendedButton>
        </ButtonWrapper>
      </Container>
    </>
  );
};

export default TaskAction;
