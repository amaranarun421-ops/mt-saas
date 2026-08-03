/**
 * Loopline widget loader.
 *
 * Paste this anywhere on your site (usually before </body>):
 *
 *   <script
 *     src="https://your-loopline-deployment.app/widget.js"
 *     data-bot-id="bot_xxx"
 *     defer
 *   ></script>
 *
 * The script creates a fixed-positioned iframe in the bottom-right corner
 * that loads /widget/[botId] on your Loopline deployment. The iframe is
 * small (just the launcher button) when closed and expands to the full
 * chat panel when opened — resizing is coordinated via postMessage so the
 * iframe never blocks page interaction while collapsed.
 */
(function () {
  // Find this script tag
  var scripts = document.getElementsByTagName("script");
  var me = null;
  for (var i = scripts.length - 1; i >= 0; i--) {
    if (scripts[i].src && scripts[i].src.indexOf("/widget.js") !== -1) {
      me = scripts[i];
      break;
    }
  }
  if (!me) return;

  var botId = me.getAttribute("data-bot-id");
  if (!botId) {
    console.error("[Loopline] missing data-bot-id attribute on widget.js script tag");
    return;
  }

  // Derive the origin from this script's src
  var srcUrl;
  try {
    srcUrl = new URL(me.src);
  } catch (e) {
    console.error("[Loopline] could not parse widget.js src", e);
    return;
  }
  var origin = srcUrl.origin;

  // Avoid double-init
  if (document.getElementById("loopline-widget-frame")) return;

  // Container
  var container = document.createElement("div");
  container.id = "loopline-widget-root";
  container.style.cssText = [
    "position: fixed",
    "bottom: 0",
    "right: 0",
    "width: 80px",
    "height: 80px",
    "z-index: 2147483000",
    "pointer-events: none",
  ].join("; ");

  // Iframe
  var frame = document.createElement("iframe");
  frame.id = "loopline-widget-frame";
  frame.src = origin + "/widget/" + encodeURIComponent(botId);
  frame.title = "Loopline chat widget";
  frame.setAttribute("aria-label", "Loopline chat widget");
  frame.allow = "clipboard-write; autoplay";
  frame.style.cssText = [
    "position: absolute",
    "bottom: 16px",
    "right: 16px",
    "width: 80px",
    "height: 80px",
    "border: 0",
    "background: transparent",
    "pointer-events: auto",
    "transition: width 250ms ease, height 250ms ease",
    "box-shadow: 0 8px 24px rgba(16, 53, 127, 0.18)",
    "border-radius: 28px",
  ].join("; ");

  container.appendChild(frame);
  document.body.appendChild(container);

  // Listen for resize messages from the iframe
  function onMessage(e) {
    if (e.origin !== origin) return;
    var data = e.data || {};
    if (data.type === "loopline:open") {
      var w = data.width || 380;
      var h = data.height || 600;
      // Constrain to viewport
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      if (w > vw - 32) w = vw - 32;
      if (h > vh - 32) h = vh - 32;
      frame.style.width = w + "px";
      frame.style.height = h + "px";
      frame.style.borderRadius = "16px";
    } else if (data.type === "loopline:close") {
      frame.style.width = "80px";
      frame.style.height = "80px";
      frame.style.borderRadius = "28px";
    }
  }

  if (window.addEventListener) {
    window.addEventListener("message", onMessage, false);
  } else if (window.attachEvent) {
    window.attachEvent("onmessage", onMessage);
  }
})();
