import React,{useState,useEffect} from 'react';
import { useNavigation,useNavigate,Link  } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBIcon
}
from 'mdb-react-ui-kit';

import axios from 'axios'
 
function App() {
  const [Data,setData]=useState({
    fname:"",
    lname:"",
    email:"",
    password:""
  })
    const navigate = useNavigate();
 function  handleSubmit(){
  console.log(Data)
     axios.post("http://127.0.0.1:5000/user/register",Data).then((res)=>{
       alert("Seccufully")
    console.log(Data)
      navigate('/home')
    }).catch((errr)=>{
      console.log("error 6e")
    })
   
  }
  return (
    <MDBContainer fluid className='p-12'>

      <MDBRow className='d-flex justify-content-center align-items-center h-100'>

       

        <MDBCol md='6'>

          <MDBCard className='my-5'>
            <MDBCardBody className='p-5'>

              <MDBRow>
                <MDBCol col='6'>
                  <MDBInput wrapperClass='mb-4' label='First name' id='form1' type='text' onChange={(e)=>setData({...Data,fname:e.target.value})}/>
                </MDBCol>

                <MDBCol col='6'>
                  <MDBInput wrapperClass='mb-4' label='Last name' id='form1' type='text' onChange={(e)=>setData({...Data,lname:e.target.value})}/>
                </MDBCol>
              </MDBRow>

              <MDBInput wrapperClass='mb-4' label='Email' id='form1' type='email' onChange={(e)=>setData({...Data,email:e.target.value})}/>
              <MDBInput wrapperClass='mb-4' label='Password' id='form1' type='password' onChange={(e)=>setData({...Data,password:e.target.value})}/>

              

              <MDBBtn className='w-100 mb-4' size='md' onClick={handleSubmit}>sign up</MDBBtn>

              <div className="text-center">

                <p>or sign up with:</p>

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='facebook-f' size="sm"/>
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='twitter' size="sm"/>
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='google' size="sm"/>
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='github' size="sm"/>
                </MDBBtn>

              </div>

            </MDBCardBody>
          </MDBCard>

        </MDBCol>

      </MDBRow>

    </MDBContainer>
  );
}

export default App;