import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Menu from './menu/Menu';
import DataTable from './DataTable';
import DataCourses from './DataCourses';

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Menu} />
        <Route path="/carreras" component={DataTable} />
        <Route path="/cursos" component={DataCourses} />
      </Switch>
    </Router>
  );
};

export default Routes;
