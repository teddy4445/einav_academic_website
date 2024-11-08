import { Element } from '/js/components/element.js';
import { ActionButton } from '/js/components/actionButton.js';

class CourseCard extends Element
{
	constructor(name, code, year, topic, department, semester, university, description)
	{
		super();
		this.name = name;
		this.code = code;
		this.year = year;
		this.topic = topic;
		this.department = department;
        this.semester = semester;
        this.university = university;
		this.description = description;
    }

	// convert the object into HTML
	toHtml()
	{
		var answer = '<div class="course-card-panel">'
		+'<div id="course-card-header" class="course-card-header-hard">'
		+'<h3 id="course-title">'+this.name+'</h3>'
		+'<div id="semester-info"class="personal-row"">'
		+'<p id="card-semeter" class="semester">Semster '+this.semester+'  </p>'
		+'<p class="card-year semester">'
		+'<svg width="1" height="24" viewBox="0 0 1 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="2.18557e-08" x2="0.499999" y2="24" stroke="#E2E8F0"/></svg>  '
		+this.year+'</p>'
		+'</div>'
		+'</div>'
		+'<p>'+this.department+'<br />'+this.university+'</p>'
		+'<div class="panel-btn personal-row space-between">'
		+'<div class="flex-start"><a href="/course-page.html?course_id='
		+ this.code + '" class="secondary-btn">Go to course</a></div>'
		+'</div>'
		+'</div>';
		return answer;
	}

    // build a list of this object from Json object
	static createListFromJson(jsonObj)
	{
		var listCourse = [];
		for (var publicationIndex = 0; publicationIndex < jsonObj.length; publicationIndex++)
		{
			listCourse.push(CourseCard.createFromJson(jsonObj[publicationIndex]));
		}
		return listCourse;
	}

    // build a list of this object from Json object
	static createFromJson(jsonObj)
	{
		return new CourseCard(jsonObj["name"],
		jsonObj["code"],
		jsonObj["year"],
		jsonObj["topic"],
		jsonObj["department"],
        jsonObj["semester"],
        jsonObj["university"],
        jsonObj["description"],);
    }

    // sort according to some property list of this object
	static sortByProperty(ObjList, propertyA, propertyB)
	{
		return ObjList.sort(function(a, b)
		{
			var x = a[propertyA + ""];
			var y = b[propertyA + ""];

			if (x === y) {
				// propertyB is only important when propertyA are the same
				return b[propertyB + ""] - a[propertyB + ""];
			 }
			 return ((x < y) ? 1 : -1);
		});
	}

    // filter the list according to some property and value
	static filterList(objList, property, filterValue)
	{

		var answer = [];
		for (var objIndex = 0; objIndex < objList.length; objIndex++)
		{
			if (objList[objIndex][property + ""].trim().toLowerCase() == filterValue.trim().toLowerCase())
			{
				answer.push(objList[objIndex]);
			}
		}

		return answer;
	}

	// split list into list of lists according to some property
	static splitByProperty(ObjList, property)
	{
		try
		{
			ObjList = CourseCard.sortByProperty(ObjList, property, property);
			var answer = {};
			var spliter = ObjList[0][property + ""];
			var subGroup = [ObjList[0]];
			for (var publicationIndex = 1; publicationIndex < ObjList.length; publicationIndex++)
			{
				if (ObjList[publicationIndex][property + ""].trim().toLowerCase() != spliter.trim().toLowerCase())
				{
					answer[spliter] = [...subGroup];
					spliter = ObjList[publicationIndex][property + ""];
					subGroup = [ObjList[publicationIndex]];
				}
				else
				{
					subGroup.push(ObjList[publicationIndex]);
				}
			}
			answer[spliter] = [...subGroup];
		}
		catch(e)
		{
			console.log("cannot split by property because: "+e);
		}
		return answer;
	}

	//create list of the name of the buttons
	static listFilterButtons(objList,property)
	{
        var answer = [];
        for (var objIndex = 0; objIndex < objList.length; objIndex++)
        {
            if (!answer.includes(objList[objIndex][property+""]))
            {
                answer.push(objList[objIndex][property+""]);
            }
		}
        return answer;
    }
}
export {CourseCard};
