import { useState, useEffect } from 'react';
import { get } from 'lodash';
import { isEmail, isInt, isFloat } from 'validator';
import PropTypes from 'prop-types';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import axios from '../../services/axios';
import { Container } from '../../styles/GlobalStyles';
import { Form, ProfilePicture } from './styled';
import Loading from '../../components/Loading';
import * as actions from '../../store/modules/auth/actions';

export default function Student({ match, history }) {
  const dispatch = useDispatch();
  const id = get(match, 'params.id', '');

  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [foto, setFoto] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function getData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/alunos/${id}`);
        const Foto = get(data, 'Photos[0].url', '');

        setNome(data.nome);
        setSobrenome(data.sobrenome);
        setEmail(data.email);
        setIdade(data.idade);
        setPeso(data.peso);
        setAltura(data.altura);
        setFoto(Foto);

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        const status = get(err, 'response.status', 0);
        const errors = get(err, 'response.data.errors', []);

        if (status === 400) errors.map((error) => toast.error(error));
        history.push('/');
      }
    }

    getData();
  }, [id, history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = false;

    if (nome.length < 3 || nome.length > 255) {
      formErrors = true;
      toast.error('Nome deve conter entre 3 e 255 caracteres.');
    }

    if (sobrenome.length < 3 || sobrenome.length > 255) {
      formErrors = true;
      toast.error('Sobrenome deve conter entre 3 e 255 caracteres.');
    }

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('E-mail inválido.');
    }

    if (!isInt(String(idade))) {
      formErrors = true;
      toast.error('Idade precisa ser um número inteiro.');
    }

    if (!isFloat(String(peso))) {
      formErrors = true;
      toast.error('Peso precisa ser um número inteiro ou ponto flutuante.');
    }

    if (!isFloat(String(altura))) {
      formErrors = true;
      toast.error('Altura precisa ser um número inteiro ou ponto flutuante.');
    }

    if (formErrors) return;

    try {
      setIsLoading(true);
      if (id) {
        await axios.put(`/alunos/${id}`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });

        toast.success('Dados alterados com sucesso!');
        history.push(`/`);
      } else {
        const { data } = await axios.post(`/alunos`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });

        toast.success('Aluno criado com sucesso!');
        history.push(`/student/${data.id}/edit`);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      const status = get(err, 'response.status', 0);
      const data = get(err, 'response.data', {});
      const errors = get(data, 'errors', []);

      if (errors.length > 0) {
        errors.map((error) => toast.error(error));
      } else {
        toast.error('Erro desconhecido');
      }

      if (status === 401) dispatch(actions.loginFailure());
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1>{id ? 'Editar aluno' : 'Novo Aluno'}</h1>

      {id && (
        <ProfilePicture>
          {foto ? (
            <img src={foto} alt={nome} title={nome} />
          ) : (
            <FaUserCircle size={180} />
          )}

          <Link to={`/photos/${id}`}>
            <FaEdit size={24} />
          </Link>
        </ProfilePicture>
      )}
      <Form onSubmit={handleSubmit}>
        <label htmlFor="nome">
          Nome:
          <input
            type="text"
            name="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu Nome"
          />
        </label>

        <label htmlFor="sobrenome">
          Sobrenome:
          <input
            type="text"
            name="sobrenome"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
            placeholder="sobrenome"
          />
        </label>

        <label htmlFor="email">
          E-mail:
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu E-mail"
          />
        </label>

        <label htmlFor="idade">
          Idade:
          <input
            type="text"
            name="idade"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            placeholder="idade"
          />
        </label>

        <label htmlFor="peso">
          Peso:
          <input
            type="text"
            name="peso"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            placeholder="peso"
          />
        </label>

        <label htmlFor="altura">
          Altura:
          <input
            type="text"
            name="altura"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            placeholder="altura"
          />
        </label>

        <button type="submit">{id ? 'Salvar' : 'Cadastrar'}</button>
      </Form>
    </Container>
  );
}

Student.propTypes = {
  match: PropTypes.shape({}).isRequired,
  history: PropTypes.shape([]).isRequired,
};
