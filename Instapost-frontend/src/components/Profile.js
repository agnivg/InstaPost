import React,{useState,useEffect,useContext} from 'react'
import { Link } from 'react-router-dom'
import {UserContext} from '../App'
import axios from 'axios'
import M from 'materialize-css'

const Profile=()=>{
    const [posts,setPosts]=useState([])
    const {state,dispatch}=useContext(UserContext)
    const [image,setImage]=useState("")
    const [dispinp,setDispinp]=useState('none')
    const [comment,setComment]=useState("")
    const [dispfollower,setDispfollower]=useState('none')
    const [dispfollowing,setDispfollowing]=useState('none')
    const [inputkey,setInputkey]=useState(Date.now());
    useEffect(()=>{
        axios({
            url:'https://instapost-backend.onrender.com/myposts',
            method:'GET',
            headers:{'auth':"Bearer "+localStorage.getItem('jwt')}
        }).then(res=>{
            setPosts(res.data.posts)
        })
    },[])
    useEffect(()=>{
        if(image){
            axios({
                url:'https://instapost-backend.onrender.com/updatepic',
                method:'PUT',
                headers:{'auth':"Bearer "+localStorage.getItem('jwt')},
                data: {profilepic:image}
            }).then((res)=>{ 
                setImage("")
                setInputkey(Date.now());
                setDispinp('none')
                if(res.data.success){
                    M.toast({html: res.data.message,classes:'#64dd17 light-green accent-4'}) 
                    localStorage.setItem('user',JSON.stringify(res.data.user))
                    dispatch({type:'UPDATEPIC',payload:res.data.user.profilepic})
                }
                else
                    M.toast({html: res.data.message,classes:'#f44336 red'})                          
            }).catch((e)=>{
                console.log("Internal Server error");
            })
        }
    },[image])//to prevent axios to post before setImage is being called
    const getPosts=(data)=>{
        const newPosts=posts.map(post=>{
            if(post._id==data._id)
                return data
            else
                return post
        })
        setPosts(newPosts)
    }
    const submit=async(e)=>{
        const files = Array.from(e.target.files)
        files.map(async file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const form = new FormData();
                form.append("image", file)
                const response = await fetch("https://api.imgbb.com/1/upload?key=b25be8be2dd8588068d161a073d36cdd", {
                    body: form,
                    method: "POST"
                })
                const data = await response.json()
                setImage(data.data.display_url);
            };
            reader.onerror = error => alert(error);
        })     
    }
    const deletePost=(id)=>{
        axios({
            url:`https://instapost-backend.onrender.com/deletepost/${id}`,
            method:'DELETE',
            headers:{'auth':"Bearer "+localStorage.getItem('jwt')},
            data: {postId:id}
        }).then((res)=>{
            if(res.data.success){
                M.toast({html: res.data.message,classes:'#64dd17 light-green accent-4'}) 
                const newPosts=posts.filter(post=>{
                    if(post._id!==id)
                        return post
                })
                setPosts(newPosts)
            }
            else
                M.toast({html: res.data.message,classes:'#f44336 red'})           
        }).catch((e)=>{
            console.log(e)
            console.log("Internal Server error");
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
    const user=JSON.parse(localStorage.getItem('user'))
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
                    <button className="btn waves-effect waves-light #00bcd4 cyan" style={{margin:'5px 0px 5px 27px'}} onClick={()=>dispinp==='block'?setDispinp('none'):setDispinp('block')}>Update Pic</button>
                    <div className="file-field input-field" style={{display:dispinp}}>
                        <div className="btn #00bcd4 cyan">
                            <span>Upload Image</span>
                            <input type="file" accept='.jpeg,.jpg,.png' onChange={submit} key={inputkey}/>
                        </div>
                            <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" key={inputkey}/>
                        </div>
                    </div>
                </div>
                <div>
                    <h4>{user.name}</h4>
                    <h5 style={{color:'purple'}}>{user.username}</h5>
                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                        <h6>{posts.length} {posts.length!=1?'posts':'post'}</h6>
                        <h6 style={{cursor:'pointer'}} onClick={()=>dispfollower=='none'?setDispfollower('block'):setDispfollower('none')}>{user.followers.length} {user.followers.length!=1?'followers':'follower'}</h6>
                        <h6 style={{cursor:'pointer'}} onClick={()=>dispfollowing=='none'?setDispfollowing('block'):setDispfollowing('none')}>{user.following.length} following</h6>
                    </div>
                </div>
                <div style={{display:dispfollower}}>
                    <h6 style={{fontWeight:'bold'}}>Followers:</h6>
                    {
                        user.followers.map(follower=>{
                            return(
                                <Link to={'/profile/'+follower._id}>
                                    <div style={{height:'30px'}}>
                                        <img src={follower.profilepic} style={{height:'20px',width:'20px',borderRadius:'10px'}}/>
                                        <span> {follower.username}</span>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
                <div style={{display:dispfollowing}}>
                <h6 style={{fontWeight:'bold'}}>Following:</h6>
                    {
                        user.following.map(follower=>{
                            return(
                                <Link to={'/profile/'+follower._id}>
                                    <div style={{height:'30px'}}>
                                        <img src={follower.profilepic} style={{height:'20px',width:'20px',borderRadius:'10px',paddingTop:'1px'}}/>
                                        <span> {follower.username}</span>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
            <div className='gallery'>
                {
                    posts.map((post,i)=>{
                        return(
                            <div className='card profile-card' key={post._id}>
                                <h5 style={{padding:'3px 0px 0px 10px'}}><i className="material-icons" onClick={()=>deletePost(post._id)} style={{float:'right',color:'red'}}>delete</i></h5>                     
                                <div className='card-image'>
                                    <img src={post.image} style={{height:'300px'}}/>
                                </div>
                                <div className='card-content'>
                                    <h6>{post.title}</h6>
                                    <p>{post.body}</p>                          
                                    <h6>{post.likes.length}{post.likes.length==1?' like':' likes'}</h6>                            
                                    <span style={{fontSize:'25px',marginRight:'2px'}}>{post.comments.length}</span><button style={{color:'black',backgroundColor:'white'}} onClick={()=>document.getElementById('show'+i).style.display=='none'?document.getElementById('show'+i).style.display='block':document.getElementById('show'+i).style.display='none'}><i className="material-icons">message</i></button>
                                    <button style={{color:'black',backgroundColor:'white',marginLeft:'5px'}} onClick={()=>document.getElementById('add'+i).style.display=='none'?document.getElementById('add'+i).style.display='block':document.getElementById('add'+i).style.display='none'}><i className="material-icons">add</i></button>
                                    <div style={{display:'none'}} id={'show'+i}>{
                                        post.comments.map((comment)=>{
                                            return(
                                                <h6 key={comment.writtenBy._id}><span style={{color:'blue'}}><Link to={comment.writtenBy._id==user._id?'/profile':'/profile/'+comment.writtenBy._id}>{comment.writtenBy.username}</Link>:</span> {comment.text}</h6>
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

export default Profile