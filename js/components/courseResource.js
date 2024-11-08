import { Element } from '/js/components/element.js';
import { descriptionTrim } from '/js/descriptionSlicer.js';

class CourseResource extends Element
{
	constructor(name, link, description, type)
	{
		super();
		this.name = name;
		this.link = link;
		this.description = description;
		this.type = type;
	}
	
	// convert the object into HTML
	toHtml(lastVisit, resourceClasses = "")
	{
		var classdescription = (resourceClasses=="")? "resource-description": "resource-description" + " " + resourceClasses;
		let img = '<img src="';
		switch (this.type) {
			case "slides":
				img += '/img/mdi_slideshow.png';
				break;
			case "video":
				img += '/img/mdi_video_library.png';
				break;
			default:
				img += '/img/mdi_insert_drive_file.png';
				break;
		}

		img += '" class="resource-img"/>';
		
		let html = '<div class="resource-content"><a href="'+ this.link + '" class="resource-link">' + img
				  + this.name + '</a>' + descriptionTrim(this.description, classdescription) + '</div>';

		return html;
	}
	
	// build a list of this object from Json object
	static createListFromJson(jsonObj)
	{
		var resourcesList = [];
		for(const resourceType in jsonObj) {
			let resourcesArray = [];

			jsonObj[resourceType].forEach(resource => {
				resourcesArray.push(CourseResource.createFromJson(resource));
			});

			resourcesList.push({[resourceType] : resourcesArray});
		};
		return resourcesList;

	}

	static createListFromJsonWithoutOrder(jsonObj)
	{
		var resourcesList = [];
		jsonObj.forEach(resource => {
			resourcesList.push(CourseResource.createFromJson(resource));
		});
		return resourcesList;

	}
	
	// build a list of this object from Json object
	static createFromJson(jsonObj)
	{

		return new CourseResource(jsonObj["name"],
		jsonObj["link"], 
		jsonObj["description"], 
		jsonObj["type"]);

	}
}
export {CourseResource};