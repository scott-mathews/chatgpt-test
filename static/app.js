//// SECTION 1: BOOTSTRAP ////

document.addEventListener('DOMContentLoaded', () => {
    boot();
    step();
});

conversationElement = null;

function boot() {
    console.log("booting up")

    // get the root element
    conversationElement = document.getElementById('messages-root');
}

// Call this after events that change the state of the app
async function step() {
    // get and render the conversation
    const conversation_state = await getConversation()

    // render the conversation
    conversationElement.innerHTML = renderConversation(conversation_state);
}

//// SECTION 2: API CALLS ////
async function getConversation() {
    console.log("API call: getConversation")
    // make an API call to get the conversation
    const data = await fetch('http://localhost:5000/conversation')
        .then(response => response.json())
        .then(data => {
            console.log(`GET /conversation | data:${JSON.stringify(data)}`)
            
            // resolve with date
            return data;
        });

    return data
}

async function postConversation(message) {
    console.log("API call: postConversation")
    // make an API call to post the conversation
    const data = await fetch('http://localhost:5000/conversation', {
        method: 'POST',
        body: JSON.stringify({ message: message }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(`POST /conversation | data:${JSON.stringify(data)}`)
        });

    return data
}

async function postReset() {
    console.log("API call: postReset")
    // make an API call to post the conversation
    const data = await fetch('http://localhost:5000/reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(`POST /reset | data:${JSON.stringify(data)}`)
        });

    return data
}

//// SECTION 3: RENDERING ////

// render the conversation
function renderConversation(conversationData) {
    console.log(`render call: renderConversation | conversationData: ${JSON.stringify(conversationData)}`)
    // conversation data looks like
    // [ { role: 'bla', content: 'bla' },... ]
    return `
        <div class="conversation">
            ${conversationData.map(renderMessage).join('')}
        </div>
    `
}

// render a single message
function renderMessage(messageData) {
    console.log("render call: renderMessage")
    role = messageData.role
    content = messageData.content

    // convert \n to <br> in content
    content = content.replace(/\n/g, '<br>')

    return `
        <div class="message ${role}">
            <div class="message__role"}">${role}</div>
            <div class="message__content">${content}</div>
        </div>
    `
}

//// SECTION 4: EVENT HANDLERS ////

async function onSubmitMessage() {
    console.log("event handler call: onSubmitMessage")

    // get the message from the conversation-input
    const message = document.getElementById('conversation-input').value;
    
    // reset the conversation-input
    document.getElementById('conversation-input').value = '';

    // post the message
    await postConversation(message)

    step()
}

async function onReset() {
    console.log("event handler call: onResetConversation")

    // post the message
    await postReset()
        
    step()
}