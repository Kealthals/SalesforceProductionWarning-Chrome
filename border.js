"use strict";
if (isSalesforce(window.location.host)) {
    chrome.storage.sync.get(['urls', 'tabIcon', 'overlay'], function (result) {
        onGot(result);
    });
}
function onError(error) {
    console.log(`Error: ${error}`);
}

function onGot(item) {
    let isTabIconOn = item?.tabIcon === "ON";
    let isOverlayOn = item?.overlay === "ON";
    if (item.urls == undefined || item.urls == null || JSON.stringify(item) === "{}") {
        setBorder("", window.location.host.substring(0, window.location.host.indexOf(".")), "", false, isTabIconOn, isOverlayOn);

    } else {
        var flg = false;

        var records = item.urls;

        records.forEach(function (element) {
            if (setBorder(element.color, element.pattern, records[0].color, element.sandbox, isTabIconOn, isOverlayOn)) {
                flg = true;
            }
        });
        if (flg == false) {
            setBorder(records[0].color, window.location.host.substring(0, window.location.host.indexOf(".")), "", false, isTabIconOn, isOverlayOn);
        }
    }
    window.onresize = function () { setBorder(onGot(item)); };

}

function setBorder(color, pattern, defaultColor, sandbox, isTabIconOn, isOverlayOn) {
    if (pattern != "" &&
        (window.location.host.substring(0, window.location.host.indexOf(".")) == pattern
            || window.location.host.substring(0, window.location.host.indexOf("."))  == pattern + "--c"
            || window.location.host.substring(0, window.location.host.indexOf("--")) == pattern)) {
        var type = "classic";
        if (window.location.host.indexOf(".lightning.") > 0) {
            type = "lightning";
        }
        console.log("sandbox", sandbox);
        if (isProduction(window.location.host) || sandbox === true) {
            color = color ? color : defaultColor ? defaultColor : "red";
            addBorder(type, color);
            if(isTabIconOn) {
                setIcon(color);
            }
            if (isOverlayOn) {
                addOverlay(color);
            }
        }
        return true;
    }
    return false;
}

function addBorder(type, color) {
    if (document.querySelector("#SalesforceProductionWarningLeftBar") != null) {
        var leftBarObj = document.querySelector("#SalesforceProductionWarningLeftBar");
        leftBarObj.parentNode.removeChild(leftBarObj);
        var rightBarObj = document.querySelector("#SalesforceProductionWarningRightBar");
        rightBarObj.parentNode.removeChild(rightBarObj);
        var topBarObj = document.querySelector("#SalesforceProductionWarningTopBar");
        topBarObj.parentNode.removeChild(topBarObj);
        var buttomBarObj = document.querySelector("#SalesforceProductionWarningButtomBar");
        buttomBarObj.parentNode.removeChild(buttomBarObj);
    }
    if (type === "lightning") {
        var width = document.body.clientWidth > window.innerWidth ? window.innerWidth : document.body.clientWidth;
        var height = window.innerHeight;
        width = width - 5;
        height = height - 5;
    } else {
        var width = document.documentElement.clientWidth;
        var height = document.documentElement.clientHeight;
        width = width - 5;
        height = height - 7;
    }

    var args = "margin:0px;padding:0px;position: fixed;z-index: 100;border:2.5px solid " + color + ";background:" + color;

    addBar("SalesforceProductionWarningLeftBar", args + ";width: 0px;height:" + height + "px;top:0px;left:0px;");
    addBar("SalesforceProductionWarningTopBar", args + ";width:" + width + "px;height:0px;top:0px;left:5px;");
    addBar("SalesforceProductionWarningRightBar", args + ";width: 0px;height:" + height + "px;top:5px;left:" + width + "px;");
    addBar("SalesforceProductionWarningButtomBar", args + ";width:" + width + "px;height:0px;top:" + height + "px;left:0px;");
}

function addOverlay(color) {
    const id = 'SalesforceProductionWarningOverlay';
    if (document.querySelector(`#${id}`)) {
        return;
    }

    // default red
    const alpha = 0.05
    let rgba = `rgba(255,0,0,${alpha})`;
    if(color === 'Aqua') {
        rgba = `rgba(0,255,255,${alpha})`;
    } else if(color === "Blue") {
        rgba = `rgba(0,0,255,${alpha})`;
    } else if(color === "Green") {
        rgba = `rgba(0,128,0,${alpha})`;
    } else if(color === "Orange") {
        rgba = `rgba(255,168,0,${alpha})`;
    } else if(color === "Purple") { 
        rgba = `rgba(128,0,128,${alpha})`;
    } else if(color === "Yellow") { 
        rgba = `rgba(255,255,0,${alpha})`;
    }

    var overlay = document.createElement("DIV");
    overlay.id = id;
    overlay.style = `
    position: fixed;
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
        45deg,
        rgba(255,255,255,0.05),
        rgba(255,255,255,0.05) 10px,
        ${rgba} 10px,
        ${rgba} 20px
    );
    z-index: 2;
    pointer-events: none; 
    `;
    document.body.appendChild(overlay);
}

function setIcon(color) {
    let iconHerf = "";
    if(color === 'red' || color === 'Red') {
        iconHerf = "data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAPcA/MNoAP7htAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhEREQAAAAAREREREQAAABEREREREAAAERERERERAAAREREREREAAAIREREREQAAERERERERAAAREREREREAAAIRABEQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    } else if(color === 'Aqua') {
        iconHerf = "data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAD8w2gA4/cCAP7htAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEREREREREREREREREREREREREREREREREREREREREREREgAAABEREREAAAAAABEREQAAAAAAARERAAAAAAAAEREAAAAAAAARERIAAAAAABERAAAAAAAAEREAAAAAAAARERIAEQABAREREREREREREREREREREREREREREREREREAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    } else if(color === "Blue") {
        iconHerf = "data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAD8w2gA90ACAP7htAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEREREREREREREREREREREREREREREREREREREREREREREgAAABEREREAAAAAABEREQAAAAAAARERAAAAAAAAEREAAAAAAAARERIAAAAAABERAAAAAAAAEREAAAAAAAARERIAEQABAREREREREREREREREREREREREREREREREREAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    } else if(color === "Green") {
        iconHerf = "data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAD8w2gAO6EAAP7htAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEREREREREREREREREREREREREREREREREREREREREREREgAAABEREREAAAAAABEREQAAAAAAARERAAAAAAAAEREAAAAAAAARERIAAAAAABERAAAAAAAAEREAAAAAAAARERIAEQABAREREREREREREREREREREREREREREREREREAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    } else if(color === "Orange") {
        iconHerf = "data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAD8w2gA/uG0ABKg/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIQAAACIiIiIAAAAAACIiIgAAAAAAAiIiAAAAAAAAIiIAAAAAAAAiIiEAAAAAACIiAAAAAAAAIiIAAAAAAAAiIiEAIgACAiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    } else if(color === "Purple") {
        iconHerf = "data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAD8w2gA9wCUAP7htAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEREREREREREREREREREREREREREREREREREREREREREREgAAABEREREAAAAAABEREQAAAAAAARERAAAAAAAAEREAAAAAAAARERIAAAAAABERAAAAAAAAEREAAAAAAAARERIAEQABAREREREREREREREREREREREREREREREREREAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    } else if(color === "Yellow") {
        iconHerf = "data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAD8w2gAAPf3AP7htAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEREREREREREREREREREREREREREREREREREREREREREREgAAABEREREAAAAAABEREQAAAAAAARERAAAAAAAAEREAAAAAAAARERIAAAAAABERAAAAAAAAEREAAAAAAAARERIAEQABAREREREREREREREREREREREREREREREREREAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    }
    let elements = document.querySelectorAll('head link[rel*="icon"]');
    if(elements.length > 0) {
        Array.prototype.forEach.call(elements, function (node) {
            if(node.href.endsWith("favicon.ico")) {
                node.href = iconHerf;
            } else if(node.href.endsWith("img/one/apple-touch-icon-ipad.png")) {
                node.parentNode.removeChild(node);
                let iconLink = document.createElement('link');
                iconLink.type = 'image/x-icon';
                iconLink.rel  = 'icon';
                iconLink.href = iconHerf;
                
                document.getElementsByTagName('head')[0].appendChild(iconLink);
            }
        });
    } else {
        let iconLink = document.createElement('link');
        iconLink.type = 'image/x-icon';
        iconLink.rel  = 'icon';
        iconLink.href = iconHerf;
        
        document.getElementsByTagName('head')[0].appendChild(iconLink);
    }
}

function addBar(id, style) {
    var bar = document.createElement("DIV");
    bar.id = id;
    bar.style = style;
    document.body.appendChild(bar);
}

function isProduction(s) {
    var regu = /^(?!.*cs\d).(?!.*--).*\.lightning\.force\.com|(^login\.|^(ap|na|eu|um|usa|ind)[0-9]{1,3}\.|^(?!.*cs\d)(?!.*--).*\.my\.)(salesforce|visual\.force|visualforce)\.com$/g;
    var re = new RegExp(regu);
    if (re.test(s)) {
        return true;
    } else {
        return false;
    }
}

function isSalesforce(s) {
    var regu = /^(.*\.lightning\.force\.com|.*[\.my]?\.(salesforce|visual\.force|visualforce)\.com)$/g;
    var re = new RegExp(regu);
    if (re.test(s)) {
        return true;
    } else {
        return false;
    }
}
