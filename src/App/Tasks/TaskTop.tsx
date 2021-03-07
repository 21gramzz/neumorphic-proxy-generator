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
  padding: 2rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  color: ${props => props.theme.textColor};
  margin: 0 1rem;
  span {
    font-size: 2rem;
    font-weight: 300;
  }
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

const TaskTop: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { tasks } = useSelector((state: RootState) => state.tasks);
  return (
    <>
      <Modal showModal={showModal}>
        <AddTaskForm setShowModal={setShowModal} />
      </Modal>

      <Container>
        <Title>
          <span>Tasks ({tasks.length} Total)</span>
        </Title>
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

export default TaskTop;
