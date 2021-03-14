import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { editTask } from '../../slice/tasks';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import InputField from '../../shared/InputField';
import TextArea from '../../shared/TextArea';
import SelectBox from '../../shared/SelectBox';
import Button from '../../shared/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SSHClientOptions } from '../../ts/proxy-generator';

const Container = styled.div`
  width: 700px;
  height: 100%;
  padding: 1rem;
`;

const Header = styled.div`
  color: ${props => props.theme.textColor};
  margin-bottom: 2rem;
  span {
    font-size: 2rem;
    font-weight: 300;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 1.4rem;
  color: ${props => props.theme.textColor};
  margin-bottom: 1.5rem;
`;

const FormContainer = styled.div`
  padding: 1.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  row-gap: 1.5rem;
  column-gap: 1.5rem;
`;

const FormGroupRow = styled.div``;

const FormGroup2Rows = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2rem;
  grid-column-start: 1;
  grid-column-end: 2;
`;

const FormGroup3Rows = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 2rem;
  grid-column-start: 1;
  grid-column-end: 2;
`;

const CloseModalButton = styled.span`
  color: ${props => props.theme.textColor};
  font-size: 1.5rem;
`;

const CloseModalButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const StyledIcon = styled(FontAwesomeIcon)`
  font-size: 1.4rem;
  margin-right: 0.7rem;
`;

type Props = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  task: SSHClientOptions;
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
    <Container>
      <CloseModalButtonWrapper>
        <CloseModalButton
          onClick={() => {
            setShowModal(false);
          }}>
          <FontAwesomeIcon icon="times" fixedWidth />
        </CloseModalButton>
      </CloseModalButtonWrapper>
      <FormContainer>
        <Header>
          <span>Edit Task</span>
        </Header>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <FormGrid>
            <FormGroup2Rows>
              <FormGroupRow>
                <Label>Sever</Label>
                <SelectBox
                  name="server"
                  defaultValue={task.server}
                  ref={register({
                    required: true,
                  })}>
                  <option value="webarena">WebARENA</option>
                  <option value="indigo">Indigo</option>
                </SelectBox>
              </FormGroupRow>
              <FormGroupRow>
                <Label>Private Key</Label>
                <InputField
                  onClick={handleClick}
                  type="text"
                  name="privateKey"
                  defaultValue={task.privateKey}
                  ref={register()}
                  className={errors.privateKey ? 'is-invalid' : ''}
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
              </FormGroupRow>
            </FormGroup2Rows>
            <FormGroup3Rows>
              <FormGroupRow>
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
              </FormGroupRow>
              <FormGroupRow>
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
              </FormGroupRow>
              <FormGroupRow>
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
              </FormGroupRow>
            </FormGroup3Rows>
            <FormGroupRow>
              <Label>Host</Label>
              <InputField
                name="host"
                placeholder="ip:port:user:password"
                defaultValue={`${task.host}:${task.port}:${task.user}${
                  task.password ? ':' + task.password : ''
                }`}
                ref={register({
                  required: true,
                  pattern: /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]):[0-9]{1,6}(:[a-zA-Z0-9]{1,})+$/,
                })}
                className={errors.host ? 'is-invalid' : ''}
              />
            </FormGroupRow>
            <ButtonWrapper>
              <Button>
                <StyledIcon icon="save" fixedWidth />
                Save Task
              </Button>
            </ButtonWrapper>
          </FormGrid>
        </form>
      </FormContainer>
    </Container>
  );
};

export default EditTaskForm;
