// basic functions of CRead
// include button functions, render list settingWindow function,etc

import * as tools from "../../tools.js";

class Item {
    constructor() {
        this.title = "";
        this.subtitleRule = "";
        this.subtitle = "";
        this.lastRead = "";
    }
}

const itemSettingWindow = document.getElementById("item-setting-window");
// when click finished button, this item will be saved to storage
const newItem = new Item();
// get current tab information
const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });

// read from storage and fill list
async function renderList() {
    const itemListContainer = document.getElementById("item-list");
    itemListContainer.innerHTML = "";

    const items = await chrome.storage.sync.get();
    if (Object.keys(items).length !== 0) {
        itemListContainer.classList.remove("no-item");
        for (let i in items) {
            const item = items[i];
            //build container
            const div = document.createElement("div");
            div.classList.add("item");
            const editImg = document.createElement("img");
            editImg.src = "/resource/edit.png";
            editImg.classList.add("item-icon");
            editImg.classList.add("edit");
            editImg.setAttribute("data", i);
            editImg.addEventListener("click", function () {
                editItem(this.getAttribute("data"), 1);
            });

            const del = document.createElement("img");
            del.src = "/resource/close.png";
            del.classList.add("item-icon");
            del.classList.add("del");
            del.setAttribute("data", i);
            del.addEventListener("click", function () {
                chrome.storage.sync.remove(this.getAttribute("data"), () => {
                    del.parentElement.style.transform = "translateX(-350px)";
                    del.parentElement.style.height = "0";
                    del.parentElement.style.margin = "0";
                    del.parentElement.style.padding = "0";
                });
                del.parentNode.addEventListener("transitionend", (e) => {
                    if (e.propertyName === "height") {
                        del.parentNode.parentNode.removeChild(del.parentNode);
                        if (itemListContainer.children.length === 0) {
                            itemListContainer.classList.add("no-item");
                            itemListContainer.innerHTML = "暂无项目";
                        }
                    }
                });
            });

            div.append(del, editImg);

            // build text
            const title = item["title"];
            const subtitle = item["subtitle"];
            const lastRead = item["lastRead"];
            const span = document.createElement("span");
            span.innerHTML = title + "：" + subtitle;
            span.classList.add("item-text");
            span.title = lastRead;
            div.appendChild(span);
            itemListContainer.appendChild(div);
            span.addEventListener("click", () => {
                window.open(lastRead);
            });
        }
    } else {
        itemListContainer.classList.add("no-item");
        itemListContainer.innerHTML = "暂无项目";
    }
}

function addEditSettingWindowButtonFunction() {
    //add SettingWindow function
    // close setting window
    function closeSettingWindow() {
        itemSettingWindow.style.top = document.querySelector("html").style.getPropertyValue("--page-height");
        itemSettingWindow.addEventListener("transitionend", function _() {
            // after top transition is over,
            // change setting window class to invisible
            itemSettingWindow.classList.remove("visible");
            itemSettingWindow.classList.add("invisible");
            itemSettingWindow.removeEventListener("transitionend", _);
        });
    }

    // add finished button click function
    const finished = document.getElementById("finished");
    finished.addEventListener("click", async () => {
        const rule = document.getElementById("rule").value;
        newItem["title"] = document.getElementById("title").value;
        newItem["subtitleRule"] = document.getElementById("subtitle-rule").value;
        newItem["lastRead"] = currentTab.url;

        if (document.getElementById("edit-type").value === "0") {
            // add item
            // inject css and script
            await chrome.scripting.insertCSS({
                target: { tabId: currentTab["id"] },
                files: ["/contentScript/content-css.css"]
            });
            await chrome.scripting.executeScript({
                target: { tabId: currentTab["id"] },
                files: ["contentScript/content-script.js"]
            });
            const temp = await tools.getSubtitle(newItem["subtitleRule"], currentTab["title"], currentTab["id"]);
            if (!temp) {
                tools.warn("无效子标题规则");
                return;
            }
            // use temp to store returned value from getSubtitle
            // when subtitle rule is illegal, end function
            newItem["subtitle"] = temp;
        } else {
            // edit item
            if (!tools.checkSubtitleRuleLegal(newItem["subtitleRule"])) {
                tools.warn("无效子标题规则");
                return;
            }
            newItem["subtitle"] = document.getElementById("old-subtitle").value;
            if (document.getElementById("old-rule").value !== rule)
                await chrome.storage.sync.remove(document.getElementById("old-rule").value);
        }

        // construct store object
        const toBeStored = {};
        toBeStored[rule] = newItem;
        chrome.storage.sync.set(toBeStored, () => {
            const msg = "01" + "成功存储 " + newItem["title"];
            chrome.tabs.sendMessage(currentTab["id"], msg);
            // refresh main window
            renderList();
            // hide setting window
            closeSettingWindow();
        });
    });

    // add cancel button click function
    const cancel = document.getElementById("cancel");
    cancel.addEventListener("click", () => {
        closeSettingWindow();
    });
}

// put the information in item object to setting window
// option == 0 means add a new item
// option == 1 means edit an item
async function editItem(url, option) {
    if (option === 0) {
        // add item
        document.getElementById("rule").value = url;
        document.getElementById("title").value = "";
        document.getElementById("subtitle-rule").value = "title";
        document.getElementById("edit-type").value = 0;
    }

    if (option === 1) {
        // edit item
        const item = (await chrome.storage.sync.get(url))[url];
        document.getElementById("rule").value = url;
        document.getElementById("title").value = item["title"];
        document.getElementById("subtitle-rule").value = item["subtitleRule"];
        document.getElementById("edit-type").value = 1;
        document.getElementById("old-rule").value = url;
        document.getElementById("old-subtitle").value = item["subtitle"];
    }

    itemSettingWindow.style.top = "0";
    itemSettingWindow.classList.remove("invisible");
    itemSettingWindow.classList.add("visible");
}

export { itemSettingWindow, newItem, currentTab, editItem, renderList, addEditSettingWindowButtonFunction };
