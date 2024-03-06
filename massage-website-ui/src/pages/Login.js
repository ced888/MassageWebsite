import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import Validation from './validationfiles/LoginValidation';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login(){
    const [User, setUsers] = useState({
        email:'',
        password:''
    })

    const navigate = useNavigate();
    const[errors, setErrors] = useState({})
    const handleInput = (event) => {
        setUsers(prev => ({...prev, [event.target.name]: [event.target.value]}))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const err = Validation(User);
        setErrors(err);

        if(err.Email === "" && err.PasswordHash ===""){
            axios.post('http://localhost:3000/login', User)
            .then(res=> navigate('/'))
            .catch(err => console.log(err));
        }
    }

    return(
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
                    <p>fillleeeeeerr</p>
                    <Link to="/signup" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Create Account</Link>
                </form>
            </div>
        </div>
    )
}

export default Login