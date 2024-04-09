import React, {useContext, useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import Validation from './validationfiles/LoginValidation';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Context from '../components/Context';
import Cookies from 'universal-cookie';
import { jwtDecode } from "jwt-decode";

function Login(){
    const [User, setUsers] = useState({
        Email:'',
        PasswordHash:''
    })

    const cookies = new Cookies();
    const [ user, setUser ] = useContext(Context);


    useEffect(() => {  
        //input localstorage email and accesstoken 
        axios.post('http://localhost:3000/getUser', {
            Email: localStorage.getItem('email')
        }, {
            headers: {
            Authorization: "Bearer " + cookies.get('jwt_authorization')
        },
            withCredentials: true
        })
        .then(res => {
            console.log("resdata =", res.data);
            setUser(res.data[0]);
        })
        .catch(error => {
            console.error("Error:", error);
        });
    },[user]);
    
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
          navigate('/');
        }
      }, [user]);
    const[errors, setErrors] = useState({})
    const handleInput = (event) => {
        setUsers(prev => ({...prev, [event.target.name]: event.target.value}))
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const err = Validation(User);
        setErrors(err);
        if(err.Email === "" && err.PasswordHash ===""){
            axios.post('http://localhost:3000/login', User, { withCredentials: true })
            .then(res=> {
                if(res.data !== "Fail"){
                    setUser(res.data);
                    const access = res.data.accessToken;
                    const refresh = res.data.refreshToken;
                    const lsemail = res.data.userEmail;
                    //localStorage.setItem("accessToken", access)
                    //localStorage.setItem("refreshToken", refresh)
                    localStorage.setItem("email", lsemail)
                    //const decoded = jwtDecode(res.data.accessToken)

                    cookies.set("jwt_authorization", access, {
                    });

                    cookies.set("refresh_token", refresh, {
                    });

                } else {
                    alert("Invalid email or password");
                }         
            })
            .catch(err => console.log(err));
        }
    }

    return(
        <>
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>

                <h2>Log in</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="Email"><strong>Email</strong></label>
                        <input type="email" placeholder='Enter Email' name='Email'
                        onChange={handleInput} className='form-control rounded-0'/>
                        {errors.Email && <span className='text-danger'> {errors.Email}</span>}
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="PasswordHash"><strong>Password</strong></label>
                        <input type="password" placeholder='Enter Password' name='PasswordHash'
                        onChange={handleInput} className='form-control rounded-0'/>
                        {errors.PasswordHash && <span className='text-danger'> {errors.PasswordHash}</span>}
                    </div>
                    <button type ='submit' className='btn btn-success w-100 rounded-0'>Log in</button>

                    <Link to="/signup" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Create Account</Link>
                </form>
            </div>
        </div>
        </>
    )
}

export default Login