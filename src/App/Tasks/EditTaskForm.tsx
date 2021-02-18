import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { editTask } from '../../slice/tasks';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import InputField from '../../shared/InputField';
import TextArea from '../../shared/textArea';
import Button from '../../shared/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SSHClientOptions } from '../../ts/proxy-generator';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 3rem;
  row-gap: 2rem;
  padding: 0 5rem;
`;

const FormGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 3rem;
  grid-column-start: 1;
  grid-column-end: 3;
`;

const Header = styled.h1`
  color: ${props => props.theme.textColor};
  font-size: 2rem;
  font-weight: 300;
  margin: 0;
  grid-column-start: 1;
  grid-column-end: 3;
`;

const Label = styled.label`
  font-size: 1.4rem;
  color: ${props => props.theme.textColor};
  display: block;
  margin-bottom: 0.7rem;
`;

const TextAreaWrapper = styled.div`
  grid-column-start: 1;
  grid-column-end: 3;
`;

const ExtendedTextArea = styled(TextArea)`
  height: 120px;
`;

const Select = styled.select`
  -webkit-appearance: none;
  background-color: ${props => props.theme.main};
  color: ${props => props.theme.textColor};
  border-radius: 0.95rem;
  padding: 0.75rem 1.5rem;
  outline: 0;
  border: 0;
  width: 100%;
  box-shadow: inset 4px 3px 9px ${props => props.theme.shadow},
    inset -4px -3px 9px ${props => props.theme.light};
`;

const StyledIcon = styled(FontAwesomeIcon)`
  font-size: 1.4rem;
`;

type Props = {
  task: SSHClientOptions;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormData = {
  server: string;
  privateKey: string;
  host: string;
  port: number;
  user: string;
  password: string;
};

const EditTaskForm: React.FC<Props> = ({ task, setShowModal }) => {
  const { register, handleSubmit, errors, setValue } = useForm<FormData>();
  const dispatch = useDispatch();

  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => inputRef.current?.click();

  const handleOnSubmit = (data: FormData) => {
    const host = data.host.split(':');
    const ip = host[0];
    const port = Number(host[1]);
    const user = host[2];
    const password = host[3];
    if (ip && port && user) {
      dispatch(
        editTask({
          id: task.id,
          server: data.server,
          host: ip,
          port: port,
          user: user,
          password: password ? password : '',
          privateKey: data.privateKey,
          proxyPort: data.port,
          proxyUser: data.user,
          proxyPassword: data.password,
        }),
      );
      setShowModal(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <Container>
        <Header>Edit Task</Header>
        <div>
          <Label>Server</Label>
          <Select
            defaultValue={task.server}
            name="server"
            ref={register({
              required: true,
            })}>
            <option value="webarena">WebARENA</option>
            <option value="indigo">Indigo</option>
          </Select>
        </div>
        <div>
          <Label>Private Key</Label>
          <InputField
            type="text"
            defaultValue={task.privateKey}
            name="privateKey"
            ref={register()}
            onClick={handleClick}
            readOnly
          />
          <InputField
            type="file"
            accept=".pem,.txt,.key"
            style={{ display: 'none' }}
            ref={inputRef}
            className={errors.privateKey ? 'is-invalid' : ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const result = e.target.files ? e.target.files[0].path : '';
              setValue('privateKey', result);
            }}
          />
        </div>

        <FormGroup>
          <div>
            <Label>Proxy Port</Label>
            <InputField
              type="number"
              name="port"
              defaultValue={task.proxyPort}
              ref={register({
                required: true,
                pattern: /^[\d]{1,6}$/,
              })}
              className={errors.port ? 'is-invalid' : ''}
            />
          </div>
          <div>
            <Label>User Name</Label>
            <InputField
              name="user"
              defaultValue={task.proxyUser}
              ref={register({
                required: true,
                pattern: /^[A-Za-z][-A-Za-z0-9_]*$/,
              })}
              className={errors.user ? 'is-invalid' : ''}
            />
          </div>
          <div>
            <Label>Password</Label>
            <InputField
              type="password"
              name="password"
              defaultValue={task.proxyPassword}
              ref={register({
                required: true,
                pattern: /^[A-Za-z][-A-Za-z0-9_]*$/,
              })}
              className={errors.password ? 'is-invalid' : ''}
            />
          </div>
        </FormGroup>
        <TextAreaWrapper>
          <Label>Host</Label>
          <ExtendedTextArea
            placeholder="ip:port:user:password"
            defaultValue={`${task.host}:${task.port}:${task.user}${
              task.password ? ':' + task.password : ''
            }`}
            name="host"
            ref={register({
              required: true,
              pattern: /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]):[0-9]{1,6}(:[a-zA-Z0-9]{1,})+$/,
            })}
            className={errors.host ? 'is-invalid' : ''}
          />
        </TextAreaWrapper>
        <div>
          <Button>
            <StyledIcon icon="save" fixedWidth /> Save Task
          </Button>
        </div>
      </Container>
    </form>
  );
};

export default EditTaskForm;
