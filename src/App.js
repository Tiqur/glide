import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Layout from './components/Layout/Layout.jsx';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Layout>
          <Route exact path='/' component={Dashboard}/>
        </Layout>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
