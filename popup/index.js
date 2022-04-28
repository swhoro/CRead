import * as b from "./js/basic.js";

(function () {
  // when click addItem button
  const addItem = document.getElementById("add-item");
  addItem.addEventListener("click", function () {
    if (b.itemSettingWindow.classList.contains("invisible")) {
      // show item information in setting window
      b.editItem(b.currentTab.url, 0);
    }
  });
  b.renderList();
  b.addEditSettingWindowButtonFunction();
})();
