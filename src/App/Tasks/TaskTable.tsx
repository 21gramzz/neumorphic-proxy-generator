import React from 'react';
import TaskTableRow from './TaskTableRow';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers';

const Container = styled.div`
  box-sizing: border-box;
  padding: 35px 70px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Table = styled.table`
  color: ${props => props.theme.textColor};
  flex: 1;
  height: 100%;
  width: 100%;
  text-align: center;
  vertical-align: top;
  border-radius: 0.55rem;
`;

const TableHeader = styled.th`
  padding: 0.7rem;
`;

const TableBody = styled.tbody`
  height: 100%;
  overflow: scroll;
  display: block;
`;

const TableRow = styled.tr`
  width: 100%;
  display: inline-table;
  table-layout: fixed;
`;

const NoTaskMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70%;
  span {
    color: ${props => props.theme.textColor};
    font-size: 1.7rem;
    font-weight: 300;
  }
`;

const TaskTable: React.FC = () => {
  const { tasks } = useSelector((state: RootState) => state.tasks);
  return (
    <Container>
      {tasks.length > 0 ? (
        <Table>
          <thead>
            <TableRow>
              <TableHeader>Server</TableHeader>
              <TableHeader>Host</TableHeader>
              <TableHeader>Port</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Action</TableHeader>
            </TableRow>
          </thead>
          <TableBody>
            {tasks.map(task => (
              <TaskTableRow task={task} key={task.id} />
            ))}
          </TableBody>
        </Table>
      ) : (
        <NoTaskMessage>
          <span>No tasks available</span>
        </NoTaskMessage>
      )}
    </Container>
  );
};

export default TaskTable;
