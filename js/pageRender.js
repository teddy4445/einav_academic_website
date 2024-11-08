// Data file paths
let PLACE_HOLDER = "{}";
let SEO_JSON = "/data/jsons/seo/[].json";
let MAIN_JSON = "/data/jsons/[].json";

// globals //
let retrivedData = null;
let pageRenderClient;
// code for IE7+, Firefox, Chrome, Opera, Safari
if (window.XMLHttpRequest)
{
	pageRenderClient = new XMLHttpRequest();
}
else // code for IE6, IE5
{
	pageRenderClient = new ActiveXObject("Microsoft.XMLHTTP");
}
// end - globals //

// abstract class that each page implements to get dynamic data from the server side
class PageRender
{
	// empty constructor
	constructor()
	{
		
	}
	
	// not implemented - each page implements this method
	static build()
	{
		throw new NotImplemented("Build");
	}
	
	// guess the main files in the server if not provided 
	// TODO: think again if we need this function
	static guessDataLocation()
	{
		var pageName = location.pathname.split("/").slice(-1)[0];
		if (pageName == "")
		{
			pageName = "index";
		}
		
		return {"seo": SEO_JSON.replace(PLACE_HOLDER, pageName),
				"main": MAIN_JSON.replace(PLACE_HOLDER, pageName)}
	}
	
	// read parameters from the page's url as HTTP get 
	static readGetPrams()
	{
		return new URLSearchParams((new URL(window.location.href)).search);
	}
	
	// generic function to load data from server and put it in global var allowing any process to read it
	static loadFileFromServer(filePath, is_json = false)
	{	
		try
		{
			pageRenderClient.open("GET", filePath, false);
			pageRenderClient.onreadystatechange = function(e)
			{
				// check if the response is legit
				if (this.readyState == 4 && this.status == 200 && (this.responseText != null || this.response != null))
				{
					// if json
					if (is_json)
					{
						retrivedData = JSON.parse(this.response);
					}
					else // else - txt file
					{
						retrivedData = this.responseText;	
					}
				}
				else
				{
					retrivedData = null;
				}
			};
			pageRenderClient.send();
		}
		catch (error)
		{
			console.log("Error at PageRender.loadFileFromServer saying: " + error);
			return null;
		}
	}
}

export {PageRender, retrivedData };