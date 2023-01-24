import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import M from 'materialize-css'

const Home=()=>{
    const user=JSON.parse(localStorage.getItem('user'))
    useEffect(()=>{
        axios({
            url:'https://instapost-backend.onrender.com/allposts',
            method:'GET',
            headers:{'auth':"Bearer "+localStorage.getItem('jwt')}
        }).then(res=>{
            setPosts(res.data.posts)
        })
    },[])
    const [posts,setPosts]=useState([])
    const [comment,setComment]=useState("")
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
    return(
        <div className='gallery'>
            {
                posts.map((post,i)=>{
                return(
                    <div className='card home-card' key={post._id}>
                        <h5 style={{padding:'3px 0px 0px 10px'}}>{post.postedBy.name}{post.postedBy._id==user._id && <i className="material-icons" onClick={()=>deletePost(post._id)} style={{float:'right',color:'red'}}>delete</i>}</h5>
                        <h6 style={{padding:'3px 0px 0px 10px'}}><Link to={post.postedBy._id==user._id?'/profile':'/profile/'+post.postedBy._id}>{post.postedBy.username}</Link></h6>                        
                        <div className='card-image'>
                            <img src={post.image} style={{height:'500px'}}/>
                        </div>
                        <div className='card-content'>
                            <h6>{post.title}</h6>
                            <p>{post.body}</p>
                            {post.postedBy._id!=user._id && <i className="material-icons" style={{color:'red'}}>favorite</i>}
                            {post.postedBy._id!=user._id && (post.likes.includes(user._id)?<i className="material-icons" style={{color:'blue'}} onClick={()=>dislikePost(post._id)}>thumb_down</i>:<i className="material-icons" style={{color:'blue'}} onClick={()=>likePost(post._id)}>thumb_up</i>)}                            
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
    )
}

export default Home