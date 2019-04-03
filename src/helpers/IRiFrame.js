/* eslint-disable func-names */
const IR = {
  domain: "https://www.sandbox.investready.com",
  iFrame: null,
  app_id: null,
  previousHeight: null,
  response: null,
  init(app_id) {
    let is_safari = navigator.userAgent.indexOf("Safari") > -1;
    // Chrome has Safari in the user agent so we need to filter (https://stackoverflow.com/a/7768006/1502448)
    const is_chrome = navigator.userAgent.indexOf("Chrome") > -1;
    if (is_chrome && is_safari) {
      is_safari = false;
    }
    if (is_safari) {
      // See if cookie exists (https://stackoverflow.com/a/25617724/1502448)
      if (!document.cookie.match(/^(.*;)?\s*fixed\s*=\s*[^;]+(.*)?$/)) {
        // Set cookie to maximum (https://stackoverflow.com/a/33106316/1502448)
        document.cookie = "fixed=fixed; expires=Tue, 19 Jan 2038 03:14:07 UTC; path=/";
        window.location.replace("https://www.sandbox.investready.com/safariIframe");
      }
    }
    IR.initListener();
    IR.iFrame = document.getElementById("InvestReadyiFrame");
    IR.app_id = app_id;
    IR.startOver();
    setInterval(function() {
      const message = { app_id: IR.app_id };
      if (IR && IR.iFrame && IR.iFrame.contentWindow) IR.iFrame.contentWindow.postMessage(message, IR.domain); // send the message and target URI
    }, 500);
  },
  initListener() {
    window.addEventListener(
      "message",
      function(event) {
        try {
          if (event.data !== undefined) {
            IR.response = JSON.parse(event.data);
          }
          if (IR.response.height !== undefined) {
            IR.resize(IR.response.height);
          }
          if (IR.response.data.success !== undefined && IR.response.data.success === 1) {
            IR.complete(event.data);
          }
        } catch (e) {
          return false;
        }
      },
      false
    );
  },
  startOver() {
    IR.iFrame.src = `${IR.domain}/signup?app_id=${IR.app_id}`;

    if (window.innerWidth < 750) {
      IR.iFrame.height = "750px";
    } else {
      IR.iFrame.height = "550px";
    }
  },
  resize(changeHeightTo) {
    if (IR.previousHeight !== changeHeightTo) {
      IR.previousHeight = changeHeightTo;
      if (window.innerWidth < 750) {
        IR.iFrame.height = `${changeHeightTo + 400}px`;
      } else {
        IR.iFrame.height = `${changeHeightTo + 150}px`;
      }
    }
  },
  complete(data) {
    IR.iFrame.src = `${IR.domain}/certificate#!/form/global/thankyou`;
  },
  autoLogin(token) {
    IR.iFrame.src = `${IR.domain}/login/${token}`;
  }
};

export default IR;
