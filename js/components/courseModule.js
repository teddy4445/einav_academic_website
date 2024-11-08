import { Element } from '/js/components/element.js';
import { CourseResource } from '/js/components/courseResource.js';

class CourseModule extends Element
{
	constructor(title, explanation, resources)
	{
		super();
		this.title = title;
		this.explanation = explanation;
		this.resources = resources;
	}
	
	// convert the object into HTML
	toHtml(lastVisit)
	{
		let html = '<div class="module"><h3 class="content-title">' + this.title + '</h3><hr><h2 class="content-text">' + this.explanation + "</h2>";
		this.resources.forEach(resourceEntry => {
			//resourceEntry.sort();
			for(const resourceType in resourceEntry) {
				html += '<div class="resource"><ul class="resource-list"><li class="content-subtitle"><h5 class="resource-list-item-title">' + resourceType + '</h5></li>';
				resourceEntry[resourceType].forEach(resourceProperties => {
					let resource = CourseResource.createFromJson(resourceProperties);
					html += resource.toHtml(lastVisit, "resource-description-module");
				});
	
				html += '</ul></div>';
			}
		});

		html += '</div>';

		return html;
	}
	
	// build a list of this object from Json object
	static createListFromJson(jsonObj)
	{
		var modulesList = [];
		for (var publicationIndex = 0; publicationIndex < jsonObj.length; publicationIndex++)
		{
			modulesList.push(CourseModule.createFromJson(jsonObj[publicationIndex]));
		}
		return modulesList;
	}
	
	// build a list of this object from Json object
	static createFromJson(jsonObj)
	{
		return new CourseModule(jsonObj["title"],
		jsonObj["explanation"], 
		CourseResource.createListFromJson(jsonObj["resources"]));
	}
}
export {CourseModule};