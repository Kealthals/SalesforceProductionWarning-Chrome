var num = 7;
function onError(error) {
	console.log(`Error: ${error}`);
}

function setCurrentChoice(result) {
	if(result == undefined || result == null || JSON.stringify(result) === "{}") {
		document.querySelector("#panel").innerHTML = "<div style='border: 1px solid black;margin: 1px; background-color:white;'>No patterns.</div>";
	} else {
		var records = result.urls;
		records.forEach(function(element) {
			var pattern = element.pattern;
			var color = element.color;
			if(pattern == "------") {
				pattern = "--Default--";
			} else if(pattern == "") {
				pattern = "--None--";
			}
			if(color == "") {
				color = "white";
			}
			document.querySelector("#p" + element.no).innerHTML = "<strong>" + pattern + "</strong>";
			document.querySelector("#p" + element.no).style = "border: 1px solid black;margin: 1px; background-color:" + color;
		});
	}
}
var getting =  chrome.storage.sync.get(['urls'], function(result) {
          setCurrentChoice(result);
        });
document.querySelector("#EditBtn").addEventListener("click", JumpOptions);

function JumpOptions(e) {
	e.preventDefault();
	function onOpened() {
	  console.log(`Options page opened`);
	}

	function onError(error) {
	  console.log(`Error: ${error}`);
	}

	chrome.runtime.openOptionsPage(onOpened);
}