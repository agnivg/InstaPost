import React,{useContext} from 'react'
import { Link,useNavigate } from 'react-router-dom';
import {UserContext} from '../App'

const NavBar=()=>{
    const navigate=useNavigate()
    const {state,dispatch}=useContext(UserContext)
    const renderList=()=>{
        if(state){
            return [
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/followings">Followingsposts</Link></li>,
                <li><Link to="/createpost">Createpost</Link></li>,
                <li><button className="btn waves-effect waves-light #f44336 red" style={{marginRight:'10px'}} onClick={()=>{
                    localStorage.clear()
                    dispatch({type:'CLEAR'})
                    navigate('/signin')
                }}>Logout</button></li>
            ]
        }
        else{
            return [
                <li><Link to="/signin">Signin</Link></li>,
                <li><Link to="/signup">Signup</Link></li>
            ]
        }
    }
    return(
        <nav>
            <div className="nav-wrapper black">
                <Link to={state?"/":'/signin'} className="brand-logo left" style={{marginLeft:"10px"}}>InstaPost</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
        </nav>
    )
}

export default NavBar;