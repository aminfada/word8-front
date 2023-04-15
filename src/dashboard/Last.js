import 'antd/dist/antd.dark.css'
import { Row, Spin, notification, Button, Input } from 'antd';
import React, { useEffect, useState }  from "react";
import axios from 'axios';
import { BrowserRouter, Route, withRouter, Switch as SwitchRoute, useHistory } from "react-router-dom";
const { TextArea } = Input;

function Last() {
  const history = useHistory();
    const [IsLoading, setIsLoading] = useState(false);
    const [List, setList] = useState([]);
   

    const GetLastWords = ()=>{
      setIsLoading(true)
      let vase_url = "http://127.0.0.1:8080/" 
      axios.get(vase_url + `v1/vocab/last`,{ headers: { Authorization: localStorage.getItem("token") } })
      .then(res => {
        let data = res.data;
        setList(data)
        setIsLoading(false)
      }).catch((error) => {
        if (error.response != undefined) {
          if (error.response.status == 401) {
            localStorage.removeItem("token")   
            window.location.reload()
            return
          }
          console.log(error.response.data);
          notification["error"]({
            message: 'Error',
            description: error.response.data["message"],
          });
        }
      })   
      
    }
    

    useEffect(() => {
      GetLastWords()
    }, []);
  

    if (IsLoading) {
      return (
        <div>
            <Row align={"middle"} justify={"center"} style={{height:"100vh"}}>
              <Spin size="large" />            
            </Row>
        </div>
      );
    } else{
      return (
          <div className={"app-main-section"}>
            <Row align={"middle"} justify={"center"} className={"nav"}>
              <Button onClick={()=>{history.push("/home")}} className={"button"}>
                <h3>Home</h3>
              </Button>
            </Row>
            {
              List.map((d) =>
                <Row align={"middle"} justify={"center"}>
                  {d.title}
                </Row>
              )
            }
          </div>
        
    );
  }
}

export default Last;
