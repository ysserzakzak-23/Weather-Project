import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';
import axios from 'axios';
import moment from 'moment/dist/moment';
import "moment/dist/locale/ar";
import { useTranslation } from 'react-i18next';
moment.locale("ar"); 
let cancelAxios=null;
function App() {
  const [count, setCount] = useState(0)
  const theme = createTheme({
    typography: {
      fontFamily: ["IBM"]
    },
  });
  let [temp,setTemp]=useState({respnseTemp:null,description:"",min:null,max:null,icon:""});
  let [dateAndTime,setdateAndTime]=useState("");
  let [locale,setLocale]=useState("ar");
  const { t, i18n } = useTranslation();
  function handleTranslation(){
    if(locale=="en"){
      setLocale("ar");
      i18n.changeLanguage("ar");
      moment.locale("ar");
    }
    else{
      setLocale("en");
      i18n.changeLanguage("en");
      moment.locale("en");
    }
    setdateAndTime(moment().format('MMMM Do YYYY, h:mm:ss a'));
  }
useEffect(()=>{
  i18n.changeLanguage("ar");
  setdateAndTime(moment().format('MMMM Do YYYY, h:mm:ss a'));
  axios.get('https://api.openweathermap.org/data/2.5/weather?lat=33,96&lon=36,65&appid=9bac8414a0140b1004f9472cd49e7894',{
    cancelToken:new axios.CancelToken((c)=>{
      cancelAxios=c;
    }),
  })
  .then(function (response) {
   
    let respnseTemp=Math.round(response.data.main.temp - 272.15);
    let description=response.data.weather[0].description;
    let min=Math.round(response.data.main.temp_min - 272.15);
    let max=Math.round(response.data.main.temp_max - 272.15);
    let icon=response.data.weather[0].icon;
    console.log(response.data)
    setTemp({respnseTemp,description,min,max,icon:`https://openweathermap.org/img/wn/${icon}@2x.png`});
  })
  .catch(function (error) {
   
    console.log(error);
  })
  return () =>{
    console.log("canceling")
    cancelAxios()
  };
},[])
  return (
    <>
       <ThemeProvider theme={theme}>
         <Container maxWidth="sm">
            <div dir={locale=="ar"?"ltr":"rtl"} style={{backgroundColor:"#154388",boxShadow:"0px 11px 1px rgba(0,0,0,0,05)",padding:"5px 20px" ,width:"100%",borderRadius:"15px"}}>
                <div dir={locale=="ar"?"rtl":"ltr"} style={{display:"flex",justifyContent:"start",alignItems:"end"}}>
                <Typography variant="h2" gutterBottom style={{marginLeft:"12px"}}>
                    {t('Yabroud')}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    {dateAndTime}
                </Typography>
                </div>
                <hr/>
                <div >
                <Grid container spacing={2}>
                  <Grid size={7} style={{paddingRight:"30px"}}>
                    <CloudIcon style={{fontSize:"200px"}}/>
                   </Grid>
                   <Grid size={5}>
                    <div dir={locale=="ar"?"rtl":"ltr"} style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                     <Typography variant="h1" gutterBottom style={{margin:"0px"}}>
                          {temp.respnseTemp}
                     </Typography>
                      <img src={temp.icon}/>
                   </div>
                   <Typography variant="h6" gutterBottom >
                       {t(temp.description)}
                   </Typography>
                   <div dir={locale=="ar"?"rtl":"ltr"}  style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                    <h5> {t('min')}: {temp.min}</h5>
                    <h5 style={{margin:"0px 10px"}}>|</h5>
                    <h5> {t('max')}: {temp.max}</h5>
                   </div>
                    </Grid>
                  </Grid>
                </div>
            </div>
            <div >
            <Button variant="text" style={{color:"white",display:"flex",marginTop:"5px",outline:"none"}} 
            onClick={handleTranslation}>{locale=="en"?"Arabic":"انجليزي"}</Button>
            </div>
         </Container>
       </ThemeProvider>  
    </>
  )
}

export default App
