import 'antd/dist/antd.dark.css'
import { Row, Spin, notification, Button, Input } from 'antd';
import React, { useEffect, useState }  from "react";
import axios from 'axios';
import { BrowserRouter, Route, withRouter, Switch as SwitchRoute, useHistory } from "react-router-dom";
const { TextArea } = Input;

function Add() {
  const history = useHistory();
    const [IsLoading, setIsLoading] = useState(false);
    const [Title, setTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Id, setId] = useState(0);
   

    const SubmitWord = ()=>{
      setIsLoading(true)
      let vase_url = "https://word8-api.abcalgo.com/" 
      axios.post(vase_url+`v1/vocab`,{
        id: parseInt(Id,10),
        title: Title,
        description: Description,
      },{ headers: { Authorization: localStorage.getItem("token") } })
      .then(res => {
        localStorage.setItem("edit_title", "")
        localStorage.setItem("edit_description", "")
        localStorage.setItem("edit_id", 0)
        setIsLoading(false)
        history.push("/home");
        if (res.status){
          notification["success"]({
            message: "Success",
            description: "word has been added.",
          });
        }
      }).catch((error) => {
        setIsLoading(false)
        if (error.response != undefined) {
          if (error.response.status == 401) {
            localStorage.removeItem("token")   
            window.location.reload()
            return
          }
          console.log(error.response.data);
          notification["error"]({
            message: 'Error',
            description: "couldn't add the word",
          });
        }
      })   
    }
    

    useEffect(() => {
      if (localStorage.getItem("edit_title").length > 0) {
        setTitle(localStorage.getItem("edit_title"))
        setDescription(localStorage.getItem("edit_description"))
        setId(localStorage.getItem("edit_id"))
      }
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
              <Button className={"button"}>
                <h3 onClick={()=>{history.push("/home")}}>Home</h3>
              </Button>
            </Row>

            <Row className={"card"}>
            <Row className={"item"} justify={"space-between"}>
              <Input placeholder='Title' onChange={(e)=>setTitle(e.target.value)} value={Title}/>
            </Row>
            <Row className={"item"} justify={"space-between"}>
              <TextArea placeholder='Description' onChange={(e)=>setDescription(e.target.value)} value={Description} rows={10} />
            </Row>
            </Row>
            <Row align={"middle"} justify={"center"} className={"nav"}>
            <Button className={"button"}>
              <h3 onClick={SubmitWord}>Add</h3>
            </Button>
            </Row>
          </div>
        
    );
  }
}

export default Add;
