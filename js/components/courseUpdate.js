import { Element } from '/js/components/element.js';
import { descriptionTrim } from '/js/descriptionSlicer.js';
import { Icons } from '/js/components/icons.js';


class CourseUpdate extends Element
{
	constructor(title, link, description, date)
	{
		super();
		this.title = title;
		this.link = link;
		this.description = description;
		this.date = this._formatDateAsString(new Date(Date.parse(date)));
		
		// technical member for flag logic
		this.last_html_flag_show = false;
	}
	
	// convert the object into HTML
	toHtml(lastVisit)
	{
		let html = '<div class="update-content">';
		
		let visitTag = "";
		if (lastVisit.getTime() < this.date)
		{
			visitTag = '<img src="/img/flags/label_tag.png" style="float: right;" alt="new resource"/>';
			this.last_html_flag_show = true;
		}

		html += '<h3 class="content-title">' + this.title + visitTag + '</h3><hr>';
		html += '<h2 class="content-subtitle">' + this.date + '</h2>';
		html += descriptionTrim(this.description, "content-text");
		html += '</div>';

		return html;
	}
	
	// build a list of this object from Json object
	static createListFromJson(jsonObj)
	{
		var listStudent = [];
		for (var publicationIndex = 0; publicationIndex < jsonObj.length; publicationIndex++)
		{
			listStudent.push(CourseUpdate.createFromJson(jsonObj[publicationIndex]));
		}
		return listStudent;
	}
	
	// build a list of this object from Json object
	static createFromJson(jsonObj)
	{
		return new CourseUpdate(jsonObj["title"],
		jsonObj["link"], 
		jsonObj["description"], 
        jsonObj["date"]);
	}

	/*
		Taken from Stackoverflow: 
		https://stackoverflow.com/questions/14638018/current-time-formatting-with-javascript
	*/
	_formatDateAsString(date) {
		var months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var extensions = ["st", "nd", "rd", "th"];
		// get day
		var day = date.getDate();
		
		// get day extension (1st, 2nd, 3rd, 4th, etc....)
		if(parseInt(day / 10) == 1) {
			day += "th";
		} else {
			switch (day % 10) {
				case 1:
					day += extensions[0];
					break;
				case 2:
					day += extensions[1];
					break;
				case 3:
					day += extensions[2];
					break;
				default:
					day += extensions[3];
					break;
			}
		}

		// get month
		var month = months[date.getMonth()];
		// get year
		var year = date.getFullYear();
		return month + " " + day + ", " + year;
	}
}
export {CourseUpdate};