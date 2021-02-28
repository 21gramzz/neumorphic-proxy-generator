import styled from 'styled-components';

const TextArea = styled.textarea`
  resize: none;
  background-color: ${props => props.theme.main};
  color: ${props => props.theme.textColor};
  border-radius: 0.95rem;
  padding: 0.75rem 1.5rem;
  outline: 0;
  border: 0;
  width: 100%;
  box-shadow: inset 4px 3px 9px ${props => props.theme.shadow},
    inset -4px -3px 9px ${props => props.theme.light};
  &.is-invalid {
    border: solid 1px ${props => props.theme.danger};
  }
`;

export default TextArea;
