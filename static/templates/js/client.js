window.onload = function(){
    const host = "http://localhost:3000";
    if(axios){
        console.log("Axios imported.");
    }
    
    //Content divs
    let container = document.getElementById("container");
    let latest;
    let topics;
    let messages;

    console.log("This is the container:", container);

    let homeLoad = ()=>{
        // Optionally the request above could also be done as
        axios.get(host + "/home")
        .then(function (response) {
            debugger;
            console.log(response);
            container.innerHTML = response.data;
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {
            loadDivs();
            // always executed
        });  
    }

    let latestLoad = ()=>{
        // Optionally the request above could also be done as
        axios.get(host + '/latest', {
            params: {
            ID: 12345
            }
        })
        .then(function (response) {
            debugger;
            console.log(response);
            latest.innerHTML=response.data;
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            // always executed
        });  
    }

    let topicsLoad = ()=>{
        // Optionally the request above could also be done as
        axios.get(host + '/topics', {
            params: {
            ID: 12345
            }
        })
        .then(function (response) {
            debugger;
            console.log(response);
            topics.innerHTML=response.data;
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            // always executed
        });
    }

    let messagesLoad = ()=>{
        // Optionally the request above could also be done as
        axios.get(host + '/messages', {
            params: {
            ID: 12345
            }
        })
        .then(function (response) {
            debugger;
            console.log(response);
            messages.innerHTML=response.data;
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            // always executed
        });
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

    let loadDivs = ()=>{
        latest = this.document.getElementById("latest");
        topics = this.document.getElementById("topics");
        messages = this.document.getElementById("messages");

        //Handlers
        latestLoad();
        topicsLoad();
        messagesLoad();

        //Added event listeners for future refreshes
        latest.addEventListener("loadedLatest", ()=>{
            this.console.log("latest loaded.\n");
        });
        topics.addEventListener("loadedTopics", ()=>{
            this.console.log("topics loaded.\n");
        });
        messages.addEventListener("loadedMessages", ()=>{
            this.console.log("messages loaded.\n");
        });
    }

    container.addEventListener("loadHome",()=>{
        homeLoad();
    });

    // Create a new event
    var homeEvent = new CustomEvent('loadHome');

    // Dispatch the event
    container.dispatchEvent(homeEvent);
}