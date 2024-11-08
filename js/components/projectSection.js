import { Element } from '/js/components/element.js';
import { ActionButton } from '/js/components/actionButton.js';
import { descriptionTrim } from '/js/descriptionSlicer.js';

let ALL_TOPIC_KEY = "all";

class ProjectSection extends Element
{
	constructor(name, description, btn)
	{
		super();
		this.name = name;
		this.description = description;
		this.btn = btn;
	}

	// convert the object into HTML
	toHtml()
	{
		// TODO: make this more generic with the following things:
		// 1. dynamic list of action buttons each one with it's design from the class
		// 2.
		var answer = '<div class="project-panel"><h3>'
		+ this.name + '</h3>'
		+ descriptionTrim(this.description);
		if (this.btn["link"] != "")
		{
			answer += '<div class="personal-row space-up-20 mobile-paddig-left">';
			
			if (this.btn["link"] != "" && this.btn["link"] != undefined)
			{
				answer += '<div class="space-around"><a href="' + this.btn["link"] + '" class="download-btn"> Explore project </a></div>';
			}
			
			if (this.btn["example"] != "" && this.btn["example"] != undefined)
			{
				answer += '<div class="space-around"><a href="' + this.btn["example"] + '" class="secondary-btn"> See example </a></div>';
			}
			
			answer += '</div>';
		}
		answer += '</div>';
		return answer;
	}

	// build a list of this object from Json object
	static createListFromJson(jsonObj)
	{
		var answer = [];
		for (var projectIndex = 0; projectIndex < jsonObj.length; projectIndex++)
		{
			answer.push(ProjectSection.createFromJson(jsonObj[projectIndex]));
		}
		return answer;
	}

	// filter the list according to some property and value
	static filterList(objList, property, filterValue)
	{
		var answer = [];
		for (var objIndex = 0; objIndex < objList.length; objIndex++)
		{
			if (objList[objIndex][property + ""] == filterValue || filterValue == ALL_TOPIC_KEY)
			{
				answer.push(objList[objIndex]);
			}
		}
		return answer;
	}

	// build a list of this object from Json object
	static createFromJson(jsonObj)
	{
		return new ProjectSection(jsonObj["name"],
		jsonObj["description"],
		ActionButton.createFromJson(jsonObj["link"]));
	}
}
export {ProjectSection};
