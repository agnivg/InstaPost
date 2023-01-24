import React,{useState,useEffect,useContext} from 'react'
import { useParams,Link } from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'
import axios from 'axios'

const Userprofile=()=>{
    const [posts,setPosts]=useState([])
    const [user,setUser]=useState()
    const [comment,setComment]=useState("")
    const {id}=useParams()
    const {state,dispatch}=useContext(UserContext)
    useEffect(()=>{
        axios({
            url:`https://instapost-backend.onrender.com/user/${id}`,
            method:'GET',
            headers:{'auth':"Bearer "+localStorage.getItem('jwt')}
        }).then(res=>{
            setPosts(res.data.posts)
            setUser(res.data.user)
        }).catch(err=>{
            console.log('Internal Server error')
        })
    },[])
    const getPosts=(data)=>{
        const newPosts=posts.map(post=>{
            if(post._id==data._id)
                return data
            else
                return post
        })
        setPosts(newPosts)
    }
    const likePost=(id)=>{
        axios({
            url:'https://instapost-backend.onrender.com/like',
            method:'PUT',
            headers:{'auth':"Bearer "+localStorage.getItem('jwt')},
            data: {postId:id}
        }).then((res)=>{
            getPosts(res.data.result)
        }).catch((e)=>{
            console.log("Internal Server error");
        })
    }
    const dislikePost=(id)=>{
        axios({
            url:'https://instapost-backend.onrender.com/dislike',
            method:'PUT',
            headers:{'auth':"Bearer "+localStorage.getItem('jwt')},
            data: {postId:id}
        }).then((res)=>{
            getPosts(res.data.result)
        }).catch((e)=>{
            console.log("Internal Server error");
        })
    }
    const followUser=()=>{
        axios({
            url:'https://instapost-backend.onrender.com/follow',
            method:'PUT',
            headers:{'auth':"Bearer "+localStorage.getItem('jwt')},
            data:{followId:id}
        }).then(res=>{
            setUser(res.data.fuser)
            dispatch({type:'UPDATE',payload:{following:res.data.user.following,followers:res.data.user.followers}})
            localStorage.setItem('user',JSON.stringify(res.data.user))
        }).catch(err=>{
            console.log('Internal Server error')
        })
    }
    const unfollowUser=()=>{
        axios({
            url:'https://instapost-backend.onrender.com/unfollow',
            method:'PUT',
            headers:{'auth':"Bearer "+localStorage.getItem('jwt')},
            data:{unfollowId:id}
        }).then(res=>{
            setUser(res.data.fuser)
            dispatch({type:'UPDATE',payload:{following:res.data.user.following,followers:res.data.user.followers}})
            localStorage.setItem('user',JSON.stringify(res.data.user))
        }).catch(err=>{
            console.log('Internal Server error')
        })
    }
    const addComment=(id)=>{
        if(comment===""){
            M.toast({html: 'Comment line is empty',classes:'#f44336 red'})
            return
        }
        axios({
            url:'https://instapost-backend.onrender.com/addcomment',
            method:'PUT',
            headers:{'auth':"Bearer "+localStorage.getItem('jwt')},
            data: {postId:id,comment:comment}
        }).then((res)=>{
            getPosts(res.data.result)
            setComment("")
        }).catch((e)=>{
            console.log("Internal Server error");
        })
    }
    const chatRoom=()=>{
        const room1=state._id+user._id
        const room2=user._id+state._id
        const email=state.email
        const e=email.substring(0,email.indexOf('@'))+'%40'+email.substring(email.indexOf('@')+1)
        const d1=`https://instapost-chat-app.onrender.com/room?name=${state.username}&email=${e}&room=${room1}`
        const d2=`https://instapost-chat-app.onrender.com/room?name=${state.username}&email=${e}&room=${room2}`
        let d
        if(room1>room2)d=d1
        else d=d2
        window.location.href=d
    }
    return(
        <>
        {user?<div style={{maxWidth:'90%',margin:'0px auto'}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div>
                    <img style={{width:'160px',height:'160px',borderRadius:'80px',display:'block'}} src={user.profilepic}/>
                    {user.followers.includes(state._id) && user.following.includes(state._id) && <button className="btn waves-effect waves-light #4a148c purple darken-4" style={{margin:'5px 0px 5px 45px'}} onClick={()=>chatRoom()}>Chat</button>}
                </div>
                <div>
                    <h4>{user.name}</h4>
                    <h5 style={{color:'purple'}}>{user.username}</h5>
                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                        <h6>{posts.length} {posts.length!=1?'posts':'post'}</h6>
                        <h6>{user.followers.length} {user.followers.length!=1?'followers':'follower'}</h6>
                        <h6>{user.following.length} following</h6>
                    </div>
                    {user.followers.includes(state._id)?<button className="btn waves-effect waves-light #2b67ab blue darken-3" style={{marginTop:'10px',marginLeft:'35px',marginBottom:'10px'}} onClick={()=>unfollowUser()}>Unfollow</button>:<button className="btn waves-effect waves-light #2b67ab blue darken-3" style={{marginTop:'10px',marginLeft:'35px',marginBottom:'10px'}} onClick={()=>followUser()}>Follow</button>}
                </div>
            </div>
            <div className='gallery'>
                {
                    posts.map((post,i)=>{
                        return(
                            <div className='card profile-card' key={post._id}>
                                <h5 style={{padding:'3px 0px 0px 10px'}}>{post.postedBy.name}</h5>
                                <h6 style={{padding:'3px 0px 0px 10px'}}><Link to={'/profile/'+post.postedBy._id}>{post.postedBy.username}</Link></h6>                     
                                <div className='card-image'>
                                    <img src={post.image} style={{height:'300px'}}/>
                                </div>
                                <div className='card-content'>
                                    <h6>{post.title}</h6>
                                    <p>{post.body}</p>
                                    <i className="material-icons" style={{color:'red'}}>favorite</i>
                                    {post.likes.includes(state._id)?<i className="material-icons" style={{color:'blue'}} onClick={()=>dislikePost(post._id)}>thumb_down</i>:<i className="material-icons" style={{color:'blue'}} onClick={()=>likePost(post._id)}>thumb_up</i>}                          
                                    <h6>{post.likes.length}{post.likes.length==1?' like':' likes'}</h6>                            
                                    <span style={{fontSize:'25px',marginRight:'2px'}}>{post.comments.length}</span><button style={{color:'black',backgroundColor:'white'}} onClick={()=>document.getElementById('show'+i).style.display=='none'?document.getElementById('show'+i).style.display='block':document.getElementById('show'+i).style.display='none'}><i className="material-icons">message</i></button>
                                    <button style={{color:'black',backgroundColor:'white',marginLeft:'5px'}} onClick={()=>document.getElementById('add'+i).style.display=='none'?document.getElementById('add'+i).style.display='block':document.getElementById('add'+i).style.display='none'}><i className="material-icons">add</i></button>
                                    <div style={{display:'none'}} id={'show'+i}>{
                                        post.comments.map((comment)=>{
                                            return(
                                                <h6 key={comment.writtenBy._id}><span style={{color:'blue'}}><a href={comment.writtenBy._id==state._id?'/profile':'/profile/'+comment.writtenBy._id}>{comment.writtenBy.username}</a>:</span> {comment.text}</h6>
                                            )
                                        }) 
                                    }</div>                           
                                    <div style={{display:'none'}} id={'add'+i}><input type='text' placeholder='Add a comment' value={comment} onChange={(e)=>setComment(e.target.value)}/><button className="btn waves-effect waves-light #009688 teal" onClick={()=>addComment(post._id)}>Add</button></div>                                     
                                </div>
                            </div>
                        )
                    })
                }                
            </div>
        </div>:<h2>Loading....</h2>}
        </>
    )
}

export default Userprofile