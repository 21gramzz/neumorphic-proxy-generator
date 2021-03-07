import React from 'react';
import TaskTableRow from './TaskTableRow';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers';

const Container = styled.div`
  box-sizing: border-box;
  padding: 1rem 3rem 3rem;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Table = styled.table`
  background-color: ${props => props.theme.main};
  color: ${props => props.theme.textColor};
  flex: 1;
  text-align: center;
  vertical-align: top;
  border-radius: 1rem;
  border-collapse: collapse;
  height: 100%;
  width: 100%;
  box-shadow: inset 3px 3px 6px ${props => props.theme.shadow},
    inset -3px -3px 6px ${props => props.theme.light};
`;

const TableHeader = styled.th`
  padding: 1rem;
`;

const Thead = styled.thead`
  border-bottom: 0.08rem solid ${props => props.theme.subColor};
`;

const TableBody = styled.tbody`
  tr:nth-child(odd) {
    background: rgba(219, 221, 224, 0.2);
  }
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
  height: 100%;
  border-radius: 1rem;
  box-shadow: inset 3px 3px 6px ${props => props.theme.shadow},
    inset -3px -3px 6px ${props => props.theme.light};
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
          <Thead>
            <TableRow>
              <TableHeader>Server</TableHeader>
              <TableHeader>Host</TableHeader>
              <TableHeader>Port</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Action</TableHeader>
            </TableRow>
          </Thead>
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
