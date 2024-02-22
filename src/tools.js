// get title according to titleRule
// rules:
// 1.begin with '#', id selector, ex: #element
// 2.begin with '.', class selector,
// should tell the number of elements, ex: .element[0]
// 3.'title', use page title as title
// 4.'title[number]', will detect if the page title has '|','-'
// if yes, split title and order starts with 0,
// ex: title[0]
async function getSubtitle(subtitleRule, title, tabId) {
    // check if subtitleRule is illegal
    if (!checkSubtitleRuleLegal(subtitleRule)) return false;

    //id and class selector rule
    if (subtitleRule.startsWith(".") || subtitleRule.startsWith("#")) {
        let r = await chrome.tabs.sendMessage(tabId, "1" + subtitleRule);
        console.log(r);
        return r;
    }

    // the most simple, title rule
    if (subtitleRule === "title") return title;

    // split title rule
    if (subtitleRule.includes("title[")) {
        // the number of which part of title should be used
        const num = parseInt(subtitleRule.slice(6, subtitleRule.indexOf("]")));
        if (title.includes("|")) return splitSubtitleWithPageTitle(title, "|", num);
        if (title.includes("-")) return splitSubtitleWithPageTitle(title, "-", num);
    }

    function splitSubtitleWithPageTitle(title, sym, num) {
        let str = title.split(sym)[num];
        if (!str) return false;
        // delete space at the end or end of subtitle
        while (str.startsWith(" ")) str = str.slice(1);
        while (str.endsWith(" ")) str = str.slice(0, -1);
        return str;
    }

    // other illegal rules
    return false;
}

// show error information
function warn(information) {
    const cover = document.getElementById("cover");
    const inf = document.getElementById("information-div");
    const btn = document.getElementById("yes-button");

    inf.children[0].innerHTML = information;

    cover.style.display = "flex";
    cover.style.backgroundColor = getComputedStyle(cover).getPropertyValue("--cover-background-color");
    inf.style.backgroundColor = getComputedStyle(inf).getPropertyValue("--information-background-color");
    inf.children[0].style.color = getComputedStyle(inf.children[0]).getPropertyValue("--information-color");
    btn.style.color = getComputedStyle(btn).getPropertyValue("--btn-color");
    btn.style.backgroundColor = getComputedStyle(btn).getPropertyValue("--btn-background-color");

    btn.addEventListener("click", () => {
        cover.addEventListener("transitionend", function closeCover() {
            cover.style.display = "none";
            cover.removeEventListener("transitionend", closeCover);
        });

        cover.style.backgroundColor = "rgba(0, 0, 0, 0)";
        inf.style.backgroundColor = "rgba(0, 0, 0, 0)";
        inf.children[0].style.color = "rgba(0, 0, 0, 0)";
        btn.style.color = "rgba(0, 0, 0, 0)";
        btn.style.backgroundColor = "rgba(0, 0, 0, 0)";
    });
}

function checkSubtitleRuleLegal(subtitleRule) {
    if (subtitleRule.startsWith("#")) return true;
    if (/^title\[\d*]$/.test(subtitleRule)) return true;
    if (subtitleRule === "title") return true;
    if (/^\.(\w|-|_)*\[\d*]$/.test(subtitleRule)) return true;
    return false;
}

export { getSubtitle, warn, checkSubtitleRuleLegal };
