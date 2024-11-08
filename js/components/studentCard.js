import { Element } from '/js/components/element.js';
import { ProjectStudent } from '/js/components/ProjectStudent.js';

class StudentCard extends Element
{
	constructor(name, description, projects, year,degree,linked_link,publiction_link,is_alumni)
	{
		super();
		this.name=name;
		this.description=description;
		this.projects=projects;
		this.year=year;
		this.degree=degree;
		this.linked_link=linked_link;
		this.publiction_link=publiction_link;
		this.is_alumni=is_alumni;
	}
	
	// convert the object into HTML
	toHtml()
	{
		//add images 
		var answer = '<div class="student-card"><h3>' 
		+ this.name+ this.degree +'</h3><p>'
		+ this.description +'</p><div class="personal-row"><a href='
		+ this.linked_link +'><img src=""></a><a href='
		+ this.publiction_link +'><img src=""></a></div><div>'
		return answer
	}
	
	// build a list of this object from Json object
	static createListFromJson(jsonObj)
	{
		var listStudent = [];
		for (var publicationIndex = 0; publicationIndex < jsonObj.length; publicationIndex++)
		{
			listStudent.push(StudentCard.createFromJson(jsonObj[publicationIndex]));
		}
		return listStudent;

	}
	
	// build a list of this object from Json object
	static createFromJson(jsonObj)
	{

		return new StudentCard(jsonObj["name"],
		jsonObj["description"], 
		ProjectStudent.createListFromJson(jsonObj["projects"]), 
		jsonObj["year"], 
        jsonObj["degree"], 
        jsonObj["linked_link"],
		jsonObj["publiction_link"],
		jsonObj["is_alumni"],);

	}

	// split list into list of lists according to some property
	static splitByProperty(ObjList, property)
	{
		var answer = {};
		var spliter = ObjList[0][property + ""];
		var subGroup = [ObjList[0]];
		for (var publicationIndex = 1; publicationIndex < ObjList.length; publicationIndex++)
		{
			if (ObjList[publicationIndex][property + ""] != spliter)
			{
				answer[spliter] = [...subGroup];
				spliter = ObjList[publicationIndex][property + ""];
				subGroup = [ObjList[publicationIndex]];
			}
			else
			{
				subGroup.push(ObjList[0]);
			}
		}
		answer[spliter] = [...subGroup];
		return answer;
	}
}
export {StudentCard};