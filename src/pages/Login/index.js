import { useDispatch } from 'react-redux';

// import { toast } from 'react-toastify';
import { Container } from '../../styles/GlobalStyles';
import { Title } from './styled';
import * as exampleActions from '../../store/modules/example/actions';

export default function Login() {
  // toast.success('oi');
  // toast.error('oi');
  const dispatch = useDispatch();

  function handleClick(e) {
    e.preventDefault();

    dispatch(exampleActions.clicaBotaoRequest());
  }

  return (
    <Container>
      <Title isRed={false}>Login</Title>
      <button type="button" onClick={handleClick}>
        Entrar
      </button>
    </Container>
  );
}
