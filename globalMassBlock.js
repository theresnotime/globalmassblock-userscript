// Mass block tool by [[User:Krimpet]], modified by [[User:TheresNoTime]]
// Bugs: https://github.com/theresnotime/globalmassblock-userscript
// Navigate to [[Special:Globalmassblock]] to use the tool.

function getParameter(p) {
  var re = new RegExp("&" + p + "=([^&]*)", "i");
  var c = window.location.search;
  return unescape(
    (c = c.replace(/^\?/, "&").match(re)) ? (c = c[1]) : (c = "")
  );
}

function globalmassblock() {
  if (mw.config.get("wgPageName") == "Special:Globalmassblock") {
    document.title = "Krimpet's mass block tool";
    document.getElementById("content").innerHTML =
      '<h1 class="firstHeading">Krimpet\'s mass block tool</h1><span style="color:red">' +
      "MESS SOMETHING UP WITH THIS, AND <em>YOU</em> TAKE THE BLAME, BUCKO.</span><br /><br />List of IPs to block, " +
      'one on each line please:<br><textarea id="iplist" columns="24" rows="10"></textarea><br /><br />' +
      'Expiry: <input type="text" value="6 months" id="expiry"><br />Reason: <input type="text" value="' +
      'abused [[w:open proxy|proxy]]/[[w:zombie computer|zombie]] ([[m:WM:OP|info]])" id="reason"><br />' +
      '<input type="checkbox" id="ao" /> Anon only<br />' +
      '<br />Blocks/min: <input type="text" value="10" id="epm"><br /><button ' +
      'onclick="globalmassblock2()">Block IPs</button> <button onclick="globalmassblock4()">Abort</button><div style="z-index:' +
      '-1;position:relative;top:0px;left:0px"><iframe name="globalblockframe0" width="1px" height="1px"></iframe>' +
      '<iframe name="globalblockframe1" width="1px" height="1px"></iframe><iframe name="globalblockframe2" width="1px" ' +
      'height="1px"></iframe><iframe name="globalblockframe3" width="1px" height="1px"></iframe><iframe name="globalblockframe4"' +
      'width="1px" height="1px"></iframe><iframe name="globalblockframe5" width="1px" height="1px"></iframe></div>';
  } else if (document.location.search.match("__GLOBALMASSBLOCK__")) {
    document.getElementById("mw-globalblock-anon-only").checked =
      getParameter("ao") == "1";
    document.getElementById("mw-globalblock-expiry-other").value = getParameter(
      "expiry"
    ).replace("+", " ", "g");
    document.getElementById("mw-globalblock-reason").value = getParameter(
      "reason"
    ).replace("+", " ", "g");
    setTimeout("document.forms[0].submit()", 500);
  }
}

var wgGlobalBlocksToDo;
var wgGlobalBlocksToDoIndex;
var wgGlobalBlocksToDoInterval = 0;
var wgGlobalBlockFrame;
function globalmassblock2() {
  if (!parseFloat(document.getElementById("epm").value)) return;
  wgGlobalBlocksToDo = new Array();

  iplist = document.getElementById("iplist").value.split("\n");
  for (i = 0; i < iplist.length; i++) {
    wgGlobalBlocksToDo[i] = iplist[i].split(":")[0];
  }

  mbcode =
    "globalmassblock3(wgGlobalBlocksToDo[wgGlobalBlocksToDoIndex++]);if (wgGlobalBlocksToDoIndex >= wgGlobalBlocksToDo.length) globalmassblock4();";

  wgGlobalBlocksToDoIndex = wgGlobalBlockFrame = 0;
  eval(mbcode);
  wgGlobalBlocksToDoInterval = setInterval(
    mbcode,
    (60 / parseFloat(document.getElementById("epm").value)) * 1000
  );
}

function globalmassblock3(ipToGlobalBlock) {
  if (ipToGlobalBlock + "" == "undefined") return;

  iplistobj = document.getElementById("iplist");
  if (iplistobj.value.indexOf("\n") == -1) iplistobj.value = "";
  iplistobj.value = iplistobj.value.substring(
    iplistobj.value.indexOf("\n") + 1
  );

  if (ipToGlobalBlock == "") return;

  //http://meta.wikimedia.org/w/index.php?title=Special:GlobalBlock&wpAddress=127.0.0.1&wpExpiry=other&wpExpiryOther=two%20months&wpReason=testing%20this%20script&wpAnonOnly=1
  frames["globalblockframe" + wgGlobalBlockFrame++].location.href =
    wgServer +
    wgScript +
    "?title=Special:GlobalBlock&wpAddress=" +
    ipToGlobalBlock +
    "&__GLOBALMASSBLOCK__=1&wpExpiry=other&wpExpiryOther" +
    document.getElementById("expiry").value +
    "&wpReason=" +
    document.getElementById("reason").value +
    "&wpAnonOnly=" +
    (document.getElementById("ao").checked ? "1" : "0");
  if (wgGlobalBlockFrame == 6) wgGlobalBlockFrame = 0;
}

function globalmassblock4() {
  clearInterval(wgGlobalBlocksToDoInterval);
}

$(globalmassblock);
