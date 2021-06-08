import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Layout from './components/Layout/Layout.jsx';
import { GlobalProvider } from './components/GlobalContext.jsx';

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Switch>
          <Layout>
            <Route exact path='/' component={Dashboard}/>
          </Layout>
        </Switch>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
