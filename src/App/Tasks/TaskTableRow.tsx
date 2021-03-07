import React, { useState, useEffect } from 'react';
import { SSHClientOptions } from '../../ts/proxy-generator';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { deleteTask } from '../../slice/tasks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../Modal';
import EditTaskForm from './EditTaskForm';
import { IpcRendererEvent } from 'electron';

const TableRow = styled.tr`
  width: 100%;
  box-sizing: border-box;
  display: inline-table;
  table-layout: fixed;
  border-bottom: 0.08rem solid ${props => props.theme.subColor};
  &:hover {
    border-radius: 0;
    box-shadow: inset 3px 3px 6px ${props => props.theme.shadow},
      inset -3px -3px 6px ${props => props.theme.light};
  }
`;

const TableData = styled.td`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 20%;
  padding: 1rem;
`;

const TaskStatus = styled.span<{ status: string }>`
  color: ${props =>
    props.status.includes('Failed')
      ? props.theme.danger
      : props.status.includes('Completed')
      ? props.theme.success
      : props.status.includes('Progress')
      ? props.theme.warning
      : props.theme.textColor};
`;

const IconOnlyButton = styled.span`
  color: ${props => props.theme.textColor};
  margin: 0 0.4rem;
  font-size: 1.4rem;
`;

type Props = {
  task: SSHClientOptions;
};

const TaskTableRow: React.FC<Props> = ({ task }) => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  // ステータス更新
  const [status, setStatus] = useState<string>('Inactive');

  useEffect(() => {
    const updateStatus = (event: IpcRendererEvent, newStatus: string) => {
      setStatus(newStatus);
    };
    window.api.on(`updateStatus${task.id}`, updateStatus);
    return () => {
      window.api.removeAllListeners(`updateStatus${task.id}`);
    };
  }, []);

  return (
    <>
      <Modal showModal={showModal}>
        <EditTaskForm task={task} setShowModal={setShowModal} />
      </Modal>
      <TableRow>
        <TableData>{task.server}</TableData>
        <TableData>{task.host}</TableData>
        <TableData>{task.port}</TableData>
        <TableData>
          <TaskStatus status={status}>{status}</TaskStatus>
        </TableData>
        <TableData>
          <IconOnlyButton
            onClick={() => {
              window.api.send('start', task);
            }}>
            <FontAwesomeIcon icon="play" fixedWidth />
          </IconOnlyButton>
          <IconOnlyButton
            onClick={() => {
              window.api.send('stop', task.id);
            }}>
            <FontAwesomeIcon icon="stop" fixedWidth />
          </IconOnlyButton>
          <IconOnlyButton onClick={() => setShowModal(!showModal)}>
            <FontAwesomeIcon icon="edit" fixedWidth />
          </IconOnlyButton>
          <IconOnlyButton onClick={() => dispatch(deleteTask(task.id))}>
            <FontAwesomeIcon icon="trash-alt" fixedWidth />
          </IconOnlyButton>
        </TableData>
      </TableRow>
    </>
  );
};
export default TaskTableRow;
