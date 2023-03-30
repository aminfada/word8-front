import 'antd/dist/antd.dark.css'
import { Menu, Spin, Row, Col, Switch, Button } from 'antd';
import React, { useEffect, useState,Suspense }  from "react";
import { BrowserRouter, Route, withRouter, Switch as SwitchRoute, useHistory } from "react-router-dom";
import Home from './dashboard/Home';
import Add from './dashboard/Add';


function App() {
  const history = useHistory();

  useEffect(() => {
      history.push("/home");
  }, []);

  return (
      <div className="App">
        <Row>
        <Col xs={24} xl={19}>
              <SwitchRoute>
                <Route
                  key="1"
                  path={"/home"}
                  component={Home}
                />
                <Route
                  key="2"
                  path={"/add"}
                  component={Add}
                />
              </SwitchRoute>
          </Col>
        </Row>
      </div>
  );
}

export default App;