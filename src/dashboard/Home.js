import 'antd/dist/antd.dark.css'
import { Row, Spin, notification, Button } from 'antd';
import React, { useEffect, useState }  from "react";
import axios from 'axios';
import { BrowserRouter, Route, withRouter, Switch as SwitchRoute, useHistory } from "react-router-dom";
import { CheckOutlined,CloseOutlined } from '@ant-design/icons';


function Home() {
    const history = useHistory();
    const [IsLoading, setIsLoading] = useState(false);
    const [Title, setTitle] = useState("");
    const [Id, setId] = useState(0);
    const [IsBlur, setIsBlur] = useState(true);
    const [IsHide, setIsHide] = useState(false);
    const [IsFeedbackHide, setIsFeedbackHide] = useState(false);
    const [Description, setDescription] = useState("");
   
    const timeout = (delay) => {
      return new Promise( res => setTimeout(res, delay) );
    }

    const DrawWord = async()=>{
      setIsFeedbackHide(false)
      setIsHide(true)
      setIsLoading(true)
      setIsBlur(true)
      await timeout(1000);
      setIsHide(false)
      setIsLoading(false)
      let vase_url = "https://word8-api.abcalgo.com/" 
      axios.get(vase_url + `v1/vocab`,{ headers: { Authorization: localStorage.getItem("token") } })
      .then(res => {
        let data = res.data;
        setId(data.id)
        setTitle(data.title)
        setDescription(data.description)
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

    const EditWord = ()=>{
      localStorage.setItem("edit_title", Title)
      localStorage.setItem("edit_description", Description)
      localStorage.setItem("edit_id", Id)
      history.push("/add")
    }

    const SubmitFeedback = (e)=>{
      setIsLoading(true)
      let vase_url = "https://word8-api.abcalgo.com/" 
      axios.put(vase_url+`v1/vocab`,{
        id: Id,
        success: e,
        fail: !e,
      },{ headers: { Authorization: localStorage.getItem("token") } })
      .then(res => {
        setIsLoading(false)
        setIsFeedbackHide(true)
        setIsBlur(false)
        if (res.status){
          notification["success"]({
            message: "Success",
            description: "Feedabck has been recorded.",
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
      DrawWord()
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
                <h3 onClick={()=>{history.push("/add")}}>Add</h3>
              </Button>
              <Button className={"button"}>
                <h3 onClick={DrawWord}>Fetch</h3>
              </Button>
              <Button className={"button"}>
                <h3 onClick={EditWord}>Edit</h3>
              </Button>
            </Row>
            <Row className={IsHide ? "hide" : "card"}>
              <h2>{Title}</h2>
              <pre className={IsBlur ? "blur" : "unblur"}>{Description}</pre>
            </Row>

            <Row align={"middle"} justify={"space-around"} className={IsFeedbackHide ? "feedback hide" : "feedback"}>
              <Button onClick={()=>SubmitFeedback(true)} className={"button button-success"}>
                <h3><CheckOutlined/></h3>
              </Button>
              <Button onClick={()=>SubmitFeedback(false)} className={"button button-fail"}>
                <h3><CloseOutlined/></h3>
              </Button>
            </Row>
          </div>
        
    );
  }
}

export default Home;
