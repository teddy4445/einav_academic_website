// imports
import { PageRender, retrivedData } from '/js/pageRender.js';
import { NextBlogPostCard } from '/js/components/nextBlogPostCard.js';

// Data file paths
let NEXT_BLOG_JSON = "/data/jsons/next_blog.json";

// consts
const default_sorter = "order";
const WORDS_PER_MINUTE_READING = 240;
let this_post_index = 0;

/*
	Single instance class to build academic-publications.html page with dynamic content from JSONS from the server
*/
class BlogPost extends PageRender
{
	constructor()
	{
		super();
		this.postName;
	}

	// just gather all the build of all the sections in the page - one per call to the server side
	build()
	{
		var getParms = PageRender.readGetPrams();
		var sorter;
		if (getParms.get("post") != null)
		{
			this.postName = getParms.get("post");
			this_post_index = this.postName;
		}
		
		// build the page itself
		this.buildBody();
	}

	/* build section functions */

	buildBody()
	{
		// build the UI //
		try
		{
			let client;
			// code for IE7+, Firefox, Chrome, Opera, Safari
			if (window.XMLHttpRequest)
			{
				client = new XMLHttpRequest();
			}
			else // code for IE6, IE5
			{
				client = new ActiveXObject("Microsoft.XMLHTTP");
			}
			client.onreadystatechange = contentHandler;
			client.open("GET", "/blog/blog-post-" + this.postName + ".html", false);
			client.send();
		}
		catch (error)
		{
			console.log("Error at BlogPost.buildBody saying: " + error);
		}
	}
}

function contentHandler() 
{
	if (this.readyState == 4 && this.status == 200 && this.responseText != null)
	{
		let paper_elements = this.responseText.split('<hr class="publications-hr">');
		let reading_time = Math.round(paper_elements[2].split(" ").length / WORDS_PER_MINUTE_READING);
		document.getElementById("title").innerHTML = paper_elements[0] + "<div class='meta-blog-post-title'>" + paper_elements[1] + " &#9679; " + reading_time + " minutes to read </div>";
		document.getElementById("content").innerHTML = paper_elements[2];
	}
	
	BlogPost.loadFileFromServer(NEXT_BLOG_JSON, true);
	let nextBlogsList;
	try
	{
		nextBlogsList = NextBlogPostCard.createListFromJson(retrivedData[this_post_index]);
		if (nextBlogsList.length > 0)
		{
			var ansewrHtml = "";
			for (var elementIndex = nextBlogsList.length - 1; elementIndex >= 0; elementIndex--)
			{
				ansewrHtml += nextBlogsList[elementIndex].toHtml();	
			}
			document.getElementById("next_papers").innerHTML = ansewrHtml;
		}
		else
		{
			document.getElementById("next_read_all").style.display = "none";
		}
	}
	catch (error)
	{
		document.getElementById("next_read_all").style.display = "none";
	}
}

// run the class build on page load
document.blogpost = new BlogPost();
document.blogpost.build();

export { BlogPost };
