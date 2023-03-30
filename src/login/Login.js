import 'antd/dist/antd.dark.css'
import './Login.css';
import { Input, Row, Button, notification } from 'antd';
import { useHistory } from "react-router-dom";
import React, { useEffect, useState }  from "react";
import { LoginOutlined } from '@ant-design/icons';
import Title from 'antd/lib/skeleton/Title';
import axios from 'axios';

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const SubmitLogin = ()=>{
    axios.post(`https://api.abcalgo.com/api/login`,{email:email,password:password})
    .then(res => {
      console.log(res);
      let data = res.data;
      if (data.token.length > 0) {
        notification["success"]({
          message: 'Welcome',
          description: "",
        });
        localStorage.setItem("token", data.token)
        window.setTimeout( window.location.reload(), 5000);
      }
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
    let accessToken = localStorage.getItem("token")
    if (accessToken == null) {
      accessToken = ""
    }
    
    if (accessToken.length > 0){
      history.push("/dashboard/summary");
    }
  }, []);


  return (
    <div>
        <Row align={"middle"} justify={"center"} style={{height:"100vh", backgroundColor:"#000c17"}}>
            <div className={"box-container"}>
                <Row className={"item"} justify={"space-between"}>
                    <span className={"title"}>Email</span>
                    <Input onChange={(e)=>setEmail(e.target.value)} value={email}/>
                </Row>
                <Row className={"item"} justify={"space-between"}>
                    <span className={"title"}>Password</span>
                    <Input.Password onChange={(e)=>setPassword(e.target.value)} value={password}/>
                </Row>
                <Button className={"button"} type="primary" shape="round" icon={<LoginOutlined />} size={50} onClick={()=>SubmitLogin()} > 
                    Login
                </Button>
            </div>               
        </Row>
    </div>
       
  );
}

export default Login;