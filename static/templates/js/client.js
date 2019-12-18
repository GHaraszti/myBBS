window.onload = function(){
    if(axios){
        console.log("Axios imported.");
    }
    
    let container = this.document.getElementById("#container");

    let homeLoad = ()=>{
        container.innerHTML();
    }

    let loginLoad = ()=>{

    }

    let loginPost = (email, pw)=>{
        axios.post('/login',{
            email:email,
            password:pw
        }).then((token)=>{
            console.log(`Token: ${token}.`);
        });
    }
}