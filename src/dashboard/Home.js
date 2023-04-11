import 'antd/dist/antd.dark.css'
import { Row, Col, Spin, notification, Button } from 'antd';
import React, { useEffect, useState }  from "react";
import axios from 'axios';
import { BrowserRouter, Route, withRouter, Switch as SwitchRoute, useHistory } from "react-router-dom";
import { CheckOutlined,CloseOutlined,SoundOutlined } from '@ant-design/icons';
import Sound from 'react-sound';

function Home() {
    const history = useHistory();
    const [IsLoading, setIsLoading] = useState(false);
    const [Title, setTitle] = useState("");
    const [Id, setId] = useState(0);
    const [IsTitleBlur, setIsTitleBlur] = useState(true);
    const [IsDescriptionBlur, setIsDescriptionBlur] = useState(true);
    const [IsHide, setIsHide] = useState(false);
    const [IsFeedbackHide, setIsFeedbackHide] = useState(false);
    const [Description, setDescription] = useState("");
    const [IsPlayingSpeech, setIsPlayingSpeech] = useState(false);
    const [TotalCoverage, setTotalCoverage] = useState(0);
    const [DailyActivity, setDailyActivity] = useState(0);
   
    const timeout = (delay) => {
      return new Promise( res => setTimeout(res, delay) );
    }

    const DrawWord = async()=>{
      setIsFeedbackHide(false)
      setIsHide(true)
      setIsLoading(true)
      setIsTitleBlur(true)
      setIsDescriptionBlur(true)
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
        setTotalCoverage(data.coverage)
        setDailyActivity(data.today_activity)
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
        setIsTitleBlur(false)
        setIsDescriptionBlur(false)
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
            <Sound
              url={"https://word8-api.abcalgo.com/v1/speech?time="+Date.now()}
              playStatus={IsPlayingSpeech ? "PLAYING" : "STOPPED"}
              playFromPosition={0 /* in milliseconds */}
              onFinishedPlaying={()=>setIsPlayingSpeech(false)}
            />
            <Row align={"middle"} justify={"end"} className={"stats"}>
              <Col>total coverage: {TotalCoverage}</Col>
              <Col>daily activity: {DailyActivity}</Col>
            </Row>
            <Row align={"middle"} justify={"center"} className={"nav"}>
              <Button onClick={()=>{history.push("/add")}} className={"button"}>
                <h3>Add</h3>
              </Button>
              <Button onClick={DrawWord} className={"button"}>
                <h3>Fetch</h3>
              </Button>
              <Button disabled={IsFeedbackHide ? false : true} onClick={EditWord} className={"button"}>
                <h3>Edit</h3>
              </Button>
            </Row>
            <Row className={IsHide ? "hide" : "card"}>
              <Col onClick={()=>setIsTitleBlur(false)}><h2 className={IsTitleBlur ? "blur" : "unblur"}>{Title}</h2></Col>
              <Col className={"speech"}><SoundOutlined onClick={()=>setIsPlayingSpeech(true)}/></Col>
              <pre onClick={()=>setIsDescriptionBlur(false)} className={IsDescriptionBlur ? "blur" : "unblur"}>{Description}</pre>
            </Row>

            <Row align={"middle"} justify={"space-around"} className={"feedback"}>
              <Button disabled={IsFeedbackHide ? true : false} onClick={()=>SubmitFeedback(true)} className={"button button-success"}>
                <h3><CheckOutlined/></h3>
              </Button>
              <Button disabled={IsFeedbackHide ? true : false} onClick={()=>SubmitFeedback(false)} className={"button button-fail"}>
                <h3><CloseOutlined/></h3>
              </Button>
            </Row>
          </div>
        
    );
  }
}

export default Home;
