// use html element input#just-for-cread to judge
// if this page has excute script
if (document.getElementById("just-for-cread")) return;
const j = document.createElement("input");
j.type = "hidden";
j.id = "just-for-cread";
document.querySelector("body").appendChild(j);

const controlledMessage = [];
const messageList = document.createElement("div");
messageList.id = "cread-message-list";
document.querySelector("body").appendChild(messageList);

// showMsg("CRead启动");

// msg format:
// (1) 00[str] = show message in str, should prevent displaying multi times
// (2) 01[str] = show message in str, do not need prevent
// (3) 1[str][num] = class selector or id selector
// when msg is class selector num is needed
chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    if (msg.charAt(0) === "0") {
        // show message
        const message = msg.slice(2);
        if (msg.charAt(1) === "0") {
            // controlled message
            if (!controlledMessage.includes(message)) {
                controlledMessage.push(message);
                showMsg(message);
                setTimeout(() => {
                    delete controlledMessage[controlledMessage.indexOf(message)];
                }, 5000);
            }
        } else {
            // no need control message
            // test message to judge if script is injected
            if (message === "test") return true;
            else showMsg(message);
        }
    }

    if (msg.charAt(0) === "1") {
        const message = msg.slice(1);
        if (message.startsWith("#")) {
            // id selector
            sendResponse(document.querySelector(message).innerHTML);
        }
        if (message.startsWith(".")) {
            //  class selector
            const classSelector = message.slice(0, message.indexOf("["));
            const num = parseInt(message.slice(message.indexOf("[") + 1, message.indexOf("]")));
            sendResponse(document.querySelectorAll(classSelector)[num].innerHTML);
        }
    }

    sendResponse(true);
});

function showMsg(msg) {
    // build message box
    const messageBox = document.createElement("div");
    messageBox.id = "cread-message-box";
    const messageSpan = document.createElement("span");
    messageSpan.innerHTML = msg;
    const line = document.createElement("div");
    messageBox.appendChild(messageSpan);
    messageBox.appendChild(line);
    messageList.appendChild(messageBox);
    // set message box animation
    messageBox.addEventListener("transitionend", (e) => {
        if (e.propertyName === "transform") messageBox.parentNode.removeChild(messageBox);
    });
    // setTimeout(() => {
    //   line.style.width = "0";
    //   messageBox.style.top = "0";
    // }, 100);
    line.addEventListener("transitionend", (e) => {
        e.preventDefault();
    });
    setTimeout(() => {
        messageBox.style.transform = "translateX(-360px)";
    }, 5000);
}
