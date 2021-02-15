import styled from 'styled-components';

const Button = styled.button`
  box-sizing: border-box;
  color: ${props => props.theme.textColor};
  background-color: ${props => props.theme.main};
  outline: 0;
  border: 0;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 0.95rem;
  text-align: center;
  box-shadow: 4px 3px 9px ${props => props.theme.shadow},
    -4px -3px 9px ${props => props.theme.light};
  &:hover {
    transform: translate(-2px, -2px);
  }
  &:active {
    box-shadow: inset 4px 3px 9px ${props => props.theme.shadow},
      inset -4px -3px 9px ${props => props.theme.light};
  }
`;

export default Button;
