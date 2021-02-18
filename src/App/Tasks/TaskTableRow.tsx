import React, { useState, useEffect } from 'react';
import { SSHClientOptions } from '../../ts/proxy-generator';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { deleteTask } from '../../slice/tasks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../Modal';
import EditTaskForm from './EditTaskForm';

type Props = {
  task: SSHClientOptions;
};

const TableRow = styled.tr`
  border-top: 0.0625rem solid #d1d9e6;
  width: 100%;
  box-sizing: border-box;
  display: inline-table;
  table-layout: fixed;
  &:hover {
    border-radius: 0.55rem;
    box-shadow: inset 4px 3px 9px ${props => props.theme.shadow},
      inset -4px -3px 9px ${props => props.theme.light};
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

const IconOnlyButton = styled.button`
  color: ${props => props.theme.textColor};
  margin: 0 0.5rem;
  padding: 0;
  border: none;
  outline: none;
  font-size: 1.4rem;
`;

const TaskTable: React.FC<Props> = ({ task }) => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  // ステータス更新
  const [status, setStatus] = useState<string>('Inactive');
  // 再描写の副作用でイベントが重複登録されるのを防ぐ
  useEffect(() => {
    ipcRenderer.once(
      `updateStatus${task.id}`,
      (event: IpcRendererEvent, message: string) => {
        setStatus(message);
      },
    );
  }, [status]);

  return (
    <>
      <Modal showModal={showModal} setShowModal={setShowModal}>
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
              ipcRenderer.send('start', task);
            }}>
            <FontAwesomeIcon icon="play" fixedWidth />
          </IconOnlyButton>
          <IconOnlyButton
            onClick={() => {
              ipcRenderer.send('stop', task.id);
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
export default TaskTable;
