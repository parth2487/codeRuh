import React,{useState,useEffect} from 'react';
import {jwtDecode} from "jwt-decode"
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
  MDBCheckbox
}
from 'mdb-react-ui-kit';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios'
import { useNavigation,useNavigate  } from "react-router-dom";
function App() {
const [showlogin,setShowLogin]=useState(false)
  const [loading,setLoading]=useState(false)
   const [error, setError] = useState(null);

  const [Data,setData]=useState({
    fname:"",
    password:""
  })

    const navigate = useNavigate();
async  function handleSubmit(){
  console.log(Data)
  navigate('/home') 
  // setLoading(true)

     axios.post("http://127.0.0.1:5000/user/login",Data).then((data)=>{
       console.log("data is")
     console.log(data)
     if(data){
     alert("Seccufully")
     localStorage.setItem("userData",JSON.stringify(data))
      navigate('/home') 
     }
     }).catch((error)=>{
      console.log("error")
    alert("ninonon")
    navigate("/")
     setError("Error: Unable to login. Please try again later."); 
     })

}
  return (
    <MDBContainer fluid>

      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>

          <MDBCard className='bg-white my-5 mx-auto' style={{borderRadius: '1rem', maxWidth: '500px'}}>
            <MDBCardBody className='p-5 w-100 d-flex flex-column'>

              <h2 className="fw-bold mb-2 text-center">Sign in</h2>
              <p className="text-white-50 mb-3">Please enter your login and password!</p>

              <MDBInput wrapperClass='mb-4 w-100' label='Email address' id='formControlLg' type='email' size="lg" onChange={(e)=>setData({...Data,fname:e.target.value})}/>
              <MDBInput wrapperClass='mb-4 w-100' label='Password' id='formControlLg' type='password' size="lg" onChange={(e)=>setData({...Data,password:e.target.value})}/>

              <MDBCheckbox name='flexCheck' id='flexCheckDefault' className='mb-4' label='Remember password' />

              <MDBBtn size='lg' onClick={handleSubmit}>
                Login
              </MDBBtn>

              <hr className="my-4" />

              <MDBBtn className="mb-2 w-100" size="lg" style={{backgroundColor: '#dd4b39'}}>
                <GoogleLogin style={{"width":"1000px"}}
  onSuccess={credentialResponse => {
    // console.log(credentialResponse);
    var decode=jwtDecode(credentialResponse.credential)
    console.log(decode)
    navigate('/home')
  }}
  onError={() => {
    console.log('Login Failed');
  }}
 
/>
              </MDBBtn>

              <MDBBtn className="mb-4 w-100" size="lg" style={{backgroundColor: '#3b5998'}}>
                <MDBIcon fab icon="facebook-f" className="mx-2"/>
                Sign in with facebook
              </MDBBtn>

            </MDBCardBody>
          </MDBCard>

        </MDBCol>
      </MDBRow>

    </MDBContainer>
  );
}

export default App;