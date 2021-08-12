import styled from 'styled-components';
import * as colors from '../../config/colors';

export const Title = styled.h1`
  text-align: center;
`;
export const Form = styled.form`
  input {
    display: none;
  }

  img {
    width: 180px;
    height: 180px;
    border-radius: 50%;
  }

  label {
    width: 180px;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #eee;
    border: 5 dashed ${colors.primaryColor};
    margin: 30px auto;
    cursor: pointer;
    border-radius: 50%;
  }
`;
