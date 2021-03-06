import { getAuthStatus } from "./app.js";

let form = document.getElementById("auth_form");
getAuthStatus()
.then(data => {
    showAuthMessage(true);
}).catch((error) => {
  showAuthMessage(false);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  document.getElementById("auth_status").innerHTML = "waiting...";

  let curatorEmailInput = document.getElementById("curatorEmailInput").value;
  let curatorPassInput = document.getElementById("curatorPassInput").value;

  let authRequest = `https://api.cicero.ly/admin/curator/get-auth-status?curatorEmail=${curatorEmailInput}&curatorPass=${curatorPassInput}&extensionPass=9saGbMoDek4yLjQKJfqyh9fAgAdKhwH8HQX8LUjh6pQjsuVdPt`;
  fetch(authRequest, { method: "get" })
    .then((res) => {
      if (res.ok) {
        res.json().then((body) => console.log(body));

        setLocalStorage({
          email: curatorEmailInput,
          password: curatorPassInput,
        });
        showAuthMessage(true);
      }
    })
    .catch((e) => {
      showAuthMessage(false);
      console.error(e);
      setLocalStorage({});
    });
});

function setLocalStorage(obj) {
  if (Object.keys(obj).length === 0) {
    chrome.storage.sync.set({ ciceroUser: obj }, () => {
      console.log("localStorage cleared");
      chrome.storage.sync.get(["ciceroUser"], (data) => {
        console.log(data);
      });
    });
    return;
  }
  chrome.storage.sync.set({ ciceroUser: obj }, () => {
    console.log("localStorage successfully set");
    chrome.storage.sync.get(["ciceroUser"], (data) => {
      console.log(data);
    });
  });
}

let shortcutLink = document.getElementById("shortcut-link");
shortcutLink.addEventListener("click", (event) => {
  chrome.tabs.create({
    url: "chrome://extensions/shortcuts",
  });
});

function showAuthMessage(status) {
  switch (status) {
    case true:
      document.getElementById("auth_form").style.display = "none";
      document.getElementById("auth_status").style.color = "forestgreen";
      document.getElementById("auth_status").innerHTML =
        "Successfully logged in";
      break;
    case false:
      document.getElementById("auth_status").style.color = "red";
      document.getElementById("auth_status").innerHTML =
        "Authentication failed";
      break;
    default:
      break;
  }
}
