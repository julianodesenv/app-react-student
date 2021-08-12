import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';

import { toast } from 'react-toastify';
import { Container } from '../../styles/GlobalStyles';

import Loading from '../../components/Loading';
import axios from '../../services/axios';
import * as actions from '../../store/modules/auth/actions';

import { Title, Form } from './styled';

export default function Photos({ match, history }) {
  const dispatch = useDispatch();
  const id = get(match, 'params.id', '');
  const [isLoading, setIsLoading] = React.useState(false);
  const [foto, setFoto] = React.useState('');

  React.useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`/alunos/${id}`);
        setFoto(get(data, 'Foto[0].url', ''));
        setIsLoading(false);
      } catch (err) {
        toast.error('Erro ao obter imagem');
        setIsLoading(false);
        history.push('/');
      }
    };

    getData();
  }, [id, history]);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    const fotoURL = URL.createObjectURL(file);

    setFoto(fotoURL);

    const formData = new FormData();
    formData.append('aluno_id', id);
    formData.append('photo', file);

    try {
      await axios.post('/photos/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Foto enviada com sucesso!');

      setIsLoading(false);
    } catch (err) {
      const { status } = get(err, 'response', '');
      toast.error('Erro ao obter imagem');
      if (status === 401) dispatch(actions.loginFailure());
      setIsLoading(false);
      history.push('/');
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Title>Fotos</Title>
      <Form>
        <label htmlFor="foto">
          {foto ? <img src={foto} alt="Foto" /> : 'Selecionar'}
          <input type="file" id="foto" onChange={handleChange} />
        </label>
      </Form>
    </Container>
  );
}

Photos.propTypes = {
  match: PropTypes.shape({}).isRequired,
  history: PropTypes.shape([]).isRequired,
};
