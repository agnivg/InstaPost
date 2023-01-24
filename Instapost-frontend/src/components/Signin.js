import React,{useState,useContext} from 'react'
import { Link,useNavigate } from 'react-router-dom';
import {UserContext} from '../App'
import axios from 'axios'
import M from 'materialize-css'

const Signin=()=>{
    const {state,dispatch}=useContext(UserContext)
    const navigate=useNavigate()
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const submit=(e)=>{
        e.preventDefault()
        const d={
            email:email,
            password:password
        }
        axios({
            url:'https://instapost-backend.onrender.com/signin',
            method:'POST',
            data: d
        }).then((res)=>{ 
            setEmail(""); 
            setPassword(""); 
            if(!res.data.success)
                M.toast({html: res.data.message,classes:'#f44336 red'})
            else{
                localStorage.setItem('jwt',res.data.token)
                localStorage.setItem('user',JSON.stringify(res.data.user))
                dispatch({type:'USER',payload:res.data.user})
                M.toast({html: res.data.message,classes:'#64dd17 light-green accent-4'}) 
                navigate('/')
            }                          
        }).catch((e)=>{
            console.log("Internal Server error");
        })
    }
    return(
        <div className='mycard'>
            <div className="card auth-card">
                <h2>SignIn</h2>
                <form onSubmit={submit}> 
                    <input type="email" placeholder='email' value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                    <input type="password" placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                    <button className="btn waves-effect waves-light #2b67ab blue darken-3" type="submit">Login</button>
                </form>
                <br/><h7><Link to="/signup">Don't have an account(SignUp)</Link></h7>
            </div>
        </div>
    )
}

export default Signin