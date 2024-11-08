import { Element } from '/js/components/element.js';

const map_dot = {
    Done: dot-green,
    In_Progress: dot-orenge,
}

class ProjectStudent extends Element
{
	constructor(name, description, status=null)
	{
		super();
		this.name = name;
		this.description = description;
		this.status = status;
	}
	
	// convert the object into HTML
	toHtml()
	{
        //to finish 
        var answer = '<div class="student-project-panel"><div class="personal-row"> <h3>' 
		+ this.name + '</h3><span class="'+ map_dot[this.status]+'"></span></div></div>'
		return answer;
	}
	
	// build a list of this object from Json object
	static createListFromJson(jsonObj)
	{
		var answer = [];
		for (var projectIndex = 0; projectIndex < jsonObj.length; projectIndex++)
		{
			answer.push(ProjectStudent.createFromJson(jsonObj[projectIndex]));
		}
		return answer;
	}
	
	// build a list of this object from Json object
	static createFromJson(jsonObj)
	{
		return new ProjectStudent(jsonObj["name"],
		jsonObj["description"], 
		jsonObj["status"]);
	}
}
export {ProjectStudent};