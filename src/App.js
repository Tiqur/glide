import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Trade from './pages/Trade/Trade.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Layout from './components/Layout/Layout.jsx';
import { GlobalProvider } from './components/GlobalContext.jsx';

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Switch>
          <Layout>
            <Route exact path="/">
              <Redirect to="/trade"/>
            </Route>
            <Route exact path='/trade' component={Trade}/>
            <Route exact path='/dashboard' component={Dashboard}/>
          </Layout>
        </Switch>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
