import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Validation } from './validationfiles/SignupValidation';
import { passValidation } from './validationfiles/SignupValidation';
import axios from 'axios';

function Signup() {

    //to do:
    //prevent duplicates
    //fix signup moving to log in page when unsucessful signup

    //suppose to check if there is a user already logged in then redirect
    
    /*
    axios.get('http://localhost:3000/getcurrentuser').then(res => {
        console.log(res.data);
    })
    .catch(err => console.log(err));
    */

    const [Customer, setCustomer] = useState({
        FirstName: '',
        LastName: '',
        Email:'',
        PhoneNumber:''
    })

    const [User, setUsers] = useState({
        Email:"",
        PasswordHash:"",
        IsAdmin: 0
    })

    const INPUT = {Customer, User};


    const navigate = useNavigate();
    const[errors, setErrors] = useState({});
    const[errors2, setErrors2] = useState({});

    const handleInput = (event) => {
        setCustomer(prev => ({...prev, [event.target.name]: event.target.value}))
    };
    const handleCheck = (event) => {
        setCustomer(prev => ({...prev, [event.target.name]: event.target.checked ? 1 : 0}))
    };

    const handleInput2 = (event) => {
        setUsers(prev => ({...prev, [event.target.name]: event.target.value}))
    };

    const handleBoth = (event) => {
        setCustomer(prev => ({...prev, [event.target.name]: event.target.value}))
        setUsers(prev => ({...prev, [event.target.name]: event.target.value}))
    };

    

    const handleSubmit = (event) => {
        event.preventDefault();

        const err = Validation(Customer);
        const err2 = passValidation(User);
        setErrors(err);
        setErrors2(err2);
        
        if(err.FirstName === "" && err.LastName === "" && err.Email === "" && err2.PasswordHash ===""){
            axios.post('http://localhost:3000/createcustomer', INPUT)
            .then(res=> {
                if (res.data === "Fail"){
                    alert("Email is already used");
                } else{ 
                    navigate('/login')
                }
            })
            .catch(err => console.log(err));
        }
    };

    return(
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Sign-Up</h2>
                <form action="" onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor="FirstName"><strong>First Name</strong></label>
                    <input type="text" placeholder='Enter First Name' name='FirstName'
                    onChange={handleInput}  className='form-control rounded-0'/>
                    {errors.FirstName && <span className='text-danger'> {errors.FirstName}</span>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="LastName"><strong>Last Name</strong></label>
                    <input type="text" placeholder='Enter Last Name' name='LastName'
                    onChange={handleInput} className='form-control rounded-0'/>
                    {errors.LastName && <span className='text-danger'> {errors.LastName}</span>}
                </div>

                <div className='mb-3'>
                    <label htmlFor="PhoneNumber"><strong>Phone Number</strong></label>
                    <input type="tel" placeholder='Enter Phone Number' name='PhoneNumber'
                    onChange={handleInput} className='form-control rounded-0'/>
                    {errors.PhoneNumber && <span className='text-danger'> {errors.PhoneNumber}</span>}
                </div>

                <div className='mb-3'>
                    <label htmlFor="Email"><strong>Email</strong></label>
                    <input type="email" placeholder='Enter Email' name='Email'
                    onChange={handleBoth} className='form-control rounded-0'/>
                    {errors.Email && <span className='text-danger'> {errors.Email}</span>}
                </div>

                <div className='mb-3'>
                    <label htmlFor="PasswordHash"><strong>Password</strong></label>
                    <input type="password" placeholder='Enter Password' name='PasswordHash'
                    onChange={handleInput2} className='form-control rounded-0'/>
                    {errors2.PasswordHash && <span className='text-danger'> {errors2.PasswordHash}</span>}
                </div>

                <button type='submit' className='btn btn-success w-100 rounded-0'>Sign up</button>
                <Link to="/login" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Log In</Link>
            </form>
        </div>
    </div>
    )
}

export default Signup