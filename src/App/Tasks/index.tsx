import React from 'react';
import styled from 'styled-components';
import TaskTable from './TaskTable';
import TaskAction from './TaskTop';
import Header from '../Header';

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Tasks: React.FC = () => {
  return (
    <Container>
      <Header />
      <TaskAction />
      <TaskTable />
    </Container>
  );
};

export default Tasks;
