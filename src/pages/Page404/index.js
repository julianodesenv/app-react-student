import { Container } from '../../styles/GlobalStyles';

import history from '../../services/history';

export default function Page404() {
  history.push('/');

  return (
    <Container>
      <h1>Page Not Found 404</h1>
    </Container>
  );
}
