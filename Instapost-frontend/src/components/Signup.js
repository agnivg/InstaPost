import React,{useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import axios from 'axios'
import M from 'materialize-css'

const Signup=()=>{
    const navigate=useNavigate()
    const [name,setName]=useState("")
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const submit=(e)=>{
        e.preventDefault()
        const d={
            name:name,
            username:username,
            email:email,
            password:password
        }
        axios({
            url:'https://instapost-backend.onrender.com/signup',
            method:'POST',
            data: d
        }).then((res)=>{
            setName(""); 
            setUsername("");  
            setEmail(""); 
            setPassword(""); 
            if(!res.data.success)
                M.toast({html: res.data.message,classes:'#f44336 red'})
            else {
                M.toast({html: res.data.message,classes:'#64dd17 light-green accent-4'})  
                navigate('/signin')
                console.log("Data submitted");
            }           
        }).catch((e)=>{
            console.log("Internal Server error");
        })
    }
    return(
        <div className='mycard'>
            <div className="card auth-card">
                <h2>SignUp</h2>
                <form onSubmit={submit}> 
                    <input type="text" placeholder='Name' value={name} onChange={(e)=>setName(e.target.value)} required />
                    <input type="text" placeholder='Username' value={username} onChange={(e)=>setUsername(e.target.value)} required />
                    <input type="email" placeholder='email' value={email} onChange={(e)=>setEmail(e.target.value)} required />
                    <input type="password" placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)} required />
                    <button className="btn waves-effect waves-light #2b67ab blue darken-3" type='submit'>Submit</button>
                </form>
                <br/><h7><Link to="/signin">Already have an account(SignIn)</Link></h7>
            </div>
        </div>
    )
}

export default Signup