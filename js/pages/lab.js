// imports
import { PageRender, retrivedData } from '/js/pageRender.js';
import { TeamCard } from '/js/components/teamCard.js';
import { addCollapseFunction } from '/js/descriptionSlicer.js';

// Data file paths
let LAB_JSON = "/data/jsons/lab.json";

// consts
const default_sorter = "order";

/*
	Single instance class to build lab.html page with dynamic content from JSONS from the server
*/
class Blog extends PageRender
{
	constructor()
	{
		super();
		Blog.loadFileFromServer(LAB_JSON, true);
		this.publicationList = TeamCard.createListFromJson(retrivedData["members"]);
	}

	// just gather all the build of all the sections in the page - one per call to the server side
	build()
	{
		// build the page itself
		this.buildBody();

		addCollapseFunction();
	}

	/* build section functions */

	buildBody(search_term = "")
	{
		// perpare ds //
		// sort the list
		var buildPublicationList = TeamCard.sortByProperty(this.publicationList, default_sorter);

		// build the UI //
		try
		{
			if (buildPublicationList.length > 0)
			{
				var ansewrHtml = "";
				for (var elementIndex = buildPublicationList.length - 1; elementIndex >= 0; elementIndex--)
				{
					if (buildPublicationList[elementIndex].title.includes(search_term) || search_term == "")
					{
						ansewrHtml += buildPublicationList[elementIndex].toHtml();	
					}
				}
				document.getElementById("team-body").innerHTML = ansewrHtml;
			}
			else // show error message
			{
				document.getElementById("team-body").innerHTML = "<h3>Currently, the lab is empty, but it will be full in a short time...</h3>"; // should not happen
			}
		}
		catch (error)
		{
			console.log("Error at Lab.buildBody saying: " + error);
		}
	}

	/* end -  build sections functions */

	/* GUI functions */
	
	search()
	{
		this.buildBody(document.getElementById("").value.trim().toLowerCase());
	}
	
	/* end - GUI functions */

}

// run the class build on page load
document.blog = new Blog();
document.blog.build();

export { Blog };
