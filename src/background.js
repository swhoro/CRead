import * as tools from "./tools.js";

const waitingTab = {};

chrome.tabs.onUpdated.addListener(async (_, __, tab) => {
  if (tab["url"].startsWith("https") || tab["url"].startsWith("http"))
    if (tab["status"] === "complete") {
      const items = await chrome.storage.sync.get();
      // judge if current tab is in storage
      for (let rule of Object.keys(items))
        if (tab["url"].includes(rule)) {
          // inject css and script
          await chrome.scripting.insertCSS({
            target: {tabId: tab["id"]},
            files: ["content-css.css"]
          });
          await chrome.scripting.executeScript({
            target: {tabId: tab["id"]},
            files: ["content-script.js"]
          });

          function mySetTimeout(tab) {
            waitingTab[tab["id"]] = setTimeout(async () => {
              // when the url and subtitle of new and old items are the same,
              // do not renew storage
              const url = tab["url"];
              const subtitle = await tools.getSubtitle(items[rule]["subtitleRule"], tab["title"], tab["id"]);
              if (subtitle === false) {
                await chrome.tabs.sendMessage(tab["id"], "00无效规则，请修改！");
                return;
              }
              if (url === items[rule]["lastRead"] && subtitle === items[rule]["subtitle"]) {
                // await chrome.tabs.sendMessage(tab["id"], "00未更新");
                return;
              }

              const newItem = {
                title: items[rule]["title"],
                subtitleRule: items[rule]["subtitleRule"],
                subtitle: subtitle,
                lastRead: tab["url"]
              };

              const toBeStored = {};
              toBeStored[rule] = newItem;
              await chrome.storage.sync.set(toBeStored);
              // chrome.tabs.sendMessage(tab["id"], "01更新" + newItem["title"]);
              delete waitingTab[tab["id"]];
            }, 500);
          }

          //renew storage
          if (Object.keys(waitingTab).includes(tab["id"].toString())) {
            clearTimeout(waitingTab[tab["id"]]);
            mySetTimeout(tab);
          } else {
            mySetTimeout(tab);
          }
          return;
        }
    }
});
