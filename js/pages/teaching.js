// imports
import { PageRender, retrivedData } from '/js/pageRender.js';
import {CourseCard} from '/js/components/courseCard.js';
import {Icons} from '/js/components/icons.js';

// Data file paths
let TAECHING_JSON = "/data/jsons/teaching.json";

// consts
let default_filter = "All Universities";

/*
	Single instance class to build teaching.html page with dynamic content from JSONS from the server
*/
class Teaching extends PageRender
{
	constructor()
	{
		super();
        Teaching.loadFileFromServer(TAECHING_JSON, true);
        this.cardList = CourseCard.createListFromJson(retrivedData["courses"]);
        this.filter = default_filter;
		this.listFilterName = CourseCard.listFilterButtons(this.cardList, this.property_university);
		
		// TODO: move outside to static member
		this.property_university = 'university';
		
		// remove alert as they not in use and can make problems
		removeAlertsPanels();
	}

    /* biuld function start */

	// just gather all the build of all the sections in the page - one per call to the server side
	build()
	{
		// build the page itself
        this.buildHeader(this.filter);
		this.buildBody(this.filter);
		this.buildFilters();
    }

	//build the header section of the page
    buildHeader(filterValue = default_filter)
	{
        try
		{
			let reset = document.getElementById("reset-btn");
			reset.innerHTML = Icons.reset() + " Reset";
			reset.addEventListener("click", this.buildBody());

			let filter_btn = document.getElementById("filter-btn");
			filter_btn.innerHTML = Icons.filter() + " Filter"
		}
        catch (error)
		{
			console.log("Error at Teaching.buildHeader saying: " + error);
		}
    }

	//build the body section of the page, start after the button filter.
    buildBody(filterValue = default_filter)
	{

		if(filterValue == default_filter)
		{
			this.clearFiltersDesign();
			document.getElementById("reset-btn").style.display = "none";
			let fils = document.getElementsByClassName("minimal");
			for(let i = 0; i < fils.length; i++)
			{
				fils[i].selectedIndex = 0;
			}
		}
		else
		{
			document.getElementById("reset-btn").style.display = "";
		}
        // sort the list
		var buildTeachingList = CourseCard.sortByProperty(this.cardList, "year", "semester");
		// if filter needed
		if (filterValue != default_filter)
		{
			let selector = document.getElementById(filterValue + "-filter");
			let selectorIndex = selector.selectedIndex;
			let filter = selector.options[selectorIndex].value;
			this.clearFiltersDesign();
			selector.classList.add("active-sort-button");
			// filter the needed list only
			buildTeachingList = CourseCard.filterList(buildTeachingList, filterValue, filter);
		}

		// split into the right sets
		var coursesSets = CourseCard.splitByProperty(buildTeachingList, 'university');
		// build the UI //
		try
		{
            if (buildTeachingList.length > 0)
			{
				var ansewrHtml = "";
				var keys = [];
				for (var spliterKey in coursesSets)
				{
					keys.push(spliterKey);
				}
				keys = keys.sort();

				for (var spliterKeyIndex = 0; spliterKeyIndex < keys.length; spliterKeyIndex++)
				{
					// add spliter
					ansewrHtml +='<div class="institution-card"><h2 class="institution-title">' + keys[spliterKeyIndex] + "</h2>";
					// add elements inside the list
					for (var elementIndex = 0; elementIndex < coursesSets[keys[spliterKeyIndex]].length; elementIndex++)
					{
						ansewrHtml += coursesSets[keys[spliterKeyIndex]][elementIndex].toHtml();
					}
					ansewrHtml+="</div>";
				}
				document.getElementById("teaching-body").innerHTML = ansewrHtml;
            }
			else // show error message
			{
				document.getElementById("teaching-body").innerHTML = "<h3>Don't have courses from universty " + filter + "</h3>";  // should not happen
			}
		}
		catch (error)
		{
			console.log("Error at Teaching.buildBody saying: " + error);
		}
    }
    /* build function end */

	/* build filters */
	buildFilters()
	{
		this.buildOneFilter("year");
		this.buildOneFilter("university");
		this.buildOneFilter("topic");
	}

	buildOneFilter(fName)
	{
		let filters = new Set();
		for(let i = 0; i < this.cardList.length; i++)
		{
			let text = this.cardList[i][fName];
			if(fName == "topic")
			{
				text = text.replaceAll("-"," ").trim().toLowerCase();

			}
			if(text == "") continue;
			filters.add(text);
		}
		filters = Array.from(filters);
		let filter = document.getElementById(fName+"-filter");
		if(filters.length < 2 || filters[0] == undefined)
		{
			filter.parentElement.classList.remove("select-wrapper");
			filter.style.display = "none";
			return;
		}
		for(let i = 0; i < filters.length; i++)
		{
			let option = document.createElement("OPTION");
			option.innerHTML = filters[i];
			filter.appendChild(option);
		}
	}

	//the function change the filter by the value.
	ChangeFilter(filter_value)
	{
		this.filter = filter_value;
		//build the new body after the filter change.
		this.buildBody(filter_value);
		//close filter display
		this.filtersDisplay();
	}

	clearFiltersDesign()
	{
		let f = document.getElementsByClassName("active-sort-button");
		if(f.length == 0) return;
		f[0].selectedIndex = 0;
		f[0].classList.remove("active-sort-button");
	}

	/*
	Show/hide filters menu
	*/
	filtersDisplay(){
		//relevent for mobile only
		if (window.innerWidth > 430) return;
		let filters = document.getElementsByClassName("select-wrapper")[0];
		if( filters.style.display =="none"){
			filters.style.display = "block";
		}else {
			filters.style.display = "none";
		}
	}

	//reset view after resize page manualy(if the user like to change the browser size)
	resetView(){
		let filters = document.getElementsByClassName("select-wrapper")[0];
		if (window.innerWidth > 430)
			filters.style.display = "block";
		else{
			filters.style.display = "none";
		}
	}
	

}

// run the class build on page load
document.teaching = new Teaching();
document.teaching.build();

// buttons click logic
document.getElementById("year-filter").addEventListener("change", () => {document.teaching.ChangeFilter("year");});
document.getElementById("topic-filter").addEventListener("change", () => {document.teaching.ChangeFilter("topic");});
document.getElementById("university-filter").addEventListener("change", () => {document.teaching.ChangeFilter("university");});
document.getElementById("reset-btn").addEventListener("click", () => {document.teaching.buildBody(default_filter);});
document.getElementById("filter-btn").addEventListener("click", () => {document.teaching.filtersDisplay();});

//event for resize page
window.onresize = document.teaching.resetView;



export { Teaching }
