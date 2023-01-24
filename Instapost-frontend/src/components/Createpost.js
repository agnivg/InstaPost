import React,{useState,useEffect} from 'react'
import axios from 'axios'
import M from 'materialize-css'

const Createpost=()=>{
    const [title,setTitle]=useState("")
    const [body,setBody]=useState("")
    const [image,setImage]=useState("")
    const [file,setFile]=useState("")
    const [inputkey,setInputkey]=useState(Date.now());  
    useEffect(()=>{
        if(image){
            const d={
                title:title,
                body:body,
                image:image
            }
            axios({
                url:'https://instapost-backend.onrender.com/createpost',
                method:'POST',
                headers:{'auth':"Bearer "+localStorage.getItem('jwt')},
                data: d
            }).then((res)=>{ 
                setTitle(""); 
                setBody(""); 
                setImage("")
                setFile("")
                setInputkey(Date.now());
                if(res.data.success){
                    M.toast({html: res.data.message,classes:'#64dd17 light-green accent-4'}) 
                }
                else
                    M.toast({html: res.data.message,classes:'#f44336 red'})                          
            }).catch((e)=>{
                console.log("Internal Server error");
            })
        }
    },[image])//to prevent axios to post before setImage is being called
    function getImageLink(e){
        setFile(e.target.files)              
    }
    const submit=async(e)=>{
        e.preventDefault() 
        const files = Array.from(file)
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
    return(
        <div className='card input-filed' style={{margin:'10px auto',maxWidth:'50%',padding:'2.5%',textAlign:'center'}}>
            <form onSubmit={submit}> 
                <input type='text' placeholder='Title' value={title} onChange={(e)=>setTitle(e.target.value)} required/>
                <input type='text' placeholder='Description' value={body} onChange={(e)=>setBody(e.target.value)} required/>
                <div className="file-field input-field">
                    <div className="btn #827717 lime darken-4">
                        <span>Upload Image</span>
                        <input type="file" accept='.jpeg,.jpg,.png' onChange={getImageLink} key={inputkey}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" key={inputkey}/>
                    </div>
                </div>
                <button className="btn waves-effect waves-light #00bcd4 cyan" type="submit">Post</button>
            </form>
        </div>
    )
}

export default Createpost