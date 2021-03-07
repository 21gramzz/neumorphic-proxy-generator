import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { addTask } from '../../slice/tasks';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import InputField from '../../shared/InputField';
import TextArea from '../../shared/TextArea';
import SelectBox from '../../shared/SelectBox';
import Button from '../../shared/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const randomString = window.api.randomString;

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
`;

const ExtendedTextArea = styled(TextArea)`
  height: 120px;
`;

const StyledIcon = styled(FontAwesomeIcon)`
  font-size: 1.4rem;
  margin-right: 0.7rem;
`;

type Props = {
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

const AddTaskForm: React.FC<Props> = ({ setShowModal }) => {
  const { register, handleSubmit, errors, setValue } = useForm<FormData>();
  const dispatch = useDispatch();

  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => inputRef.current?.click();
  const handleOnSubmit = (data: FormData) => {
    const textAreaValues = data.host.trim().split('\n');
    for (let i = 0; i < textAreaValues.length; i++) {
      const host = textAreaValues[i].split(':');
      const ip = host[0];
      const port = Number(host[1]);
      const user = host[2];
      const password = host[3];
      if (ip && port && user) {
        dispatch(
          addTask({
            id: randomString(),
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
      }
    }
    setShowModal(false);
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
          <span>Add New Task</span>
        </Header>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <FormGrid>
            <FormGroup2Rows>
              <FormGroupRow>
                <Label>Sever</Label>
                <SelectBox
                  name="server"
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
              <ExtendedTextArea
                placeholder="ip:port:user:password"
                name="host"
                ref={register({
                  required: true,
                  pattern: /^(((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]):[0-9]{1,6}:[a-zA-Z0-9]{1,}(:[a-zA-Z0-9]{1,})?(\n)?)+$/,
                })}
                className={errors.host ? 'is-invalid' : ''}
              />
            </FormGroupRow>
            <ButtonWrapper>
              <Button>
                <StyledIcon icon="plus" fixedWidth />
                Add New Task
              </Button>
            </ButtonWrapper>
          </FormGrid>
        </form>
      </FormContainer>
    </Container>
  );
};

export default AddTaskForm;
