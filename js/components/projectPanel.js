import { Element } from '/js/components/element.js';
import { ActionButton } from '/js/components/actionButton.js';
import { descriptionTrim } from '/js/descriptionSlicer.js';

class ProjectPanel extends Element
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
		var answer = '<div class="academic-papers-panel"><h3>'
		+ this.name + '</h3>'
		+ descriptionTrim(this.description);
		if (this.btn["link"] != "")
		{
			answer += '<div class="personal-row space-between"><div class="w-100 flex-btn"><a href="' + this.btn["link"] + '" class="download-btn">' + this.btn["info"] + '</a></div></div>';
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
			answer.push(ProjectPanel.createFromJson(jsonObj[projectIndex]));
		}
		return answer;
	}

	// build a list of this object from Json object
	static createFromJson(jsonObj)
	{
		return new ProjectPanel(jsonObj["name"],
		jsonObj["description"],
		ActionButton.createFromJson(jsonObj["link"]));
	}
}
export {ProjectPanel};
