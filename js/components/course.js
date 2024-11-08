import { Element } from '/js/components/element.js';
import { CourseResource } from '/js/components/courseResource.js';
import { CourseUpdate } from '/js/components/courseUpdate.js';
import { CourseModule } from '/js/components/courseModule.js';
import { descriptionTrim } from '/js/descriptionSlicer.js';
import { Icons } from '/js/components/icons.js';


class Course extends Element
{
	constructor(name, passkey, description, code, year, semester, university, department, location_class, syllabus, grade_parts, resources, updates, modules)
	{
		super();
		this.name = name;
		this.passkey = passkey;
		this.description = description;
		this.code = code;
		this.year = year;
		this.semester = semester;
		this.university = university;
		this.department = department;
		this.location_class = location_class;
		this.syllabus = syllabus;
		this.grade_parts = grade_parts;
		this.resources = resources;
		this.updates = updates;
		this.modules = modules;
		
		// technical member for flags logic in course-page
		this.newCounter = 0;
	}
	
	// convert the object into HTML
	toHtml(lastVisit = null)
	{
		// edge case - no time provide, take a really old time
		if (lastVisit == null)
		{
			lastVisit = new Date(2000, 1, 1, 0, 0, 0, 0);
		}
		
		let html = '';

		html += this.createGeneralData(lastVisit);
		html += this.createUpdateData(lastVisit);
		html += this.createModuleData(lastVisit);

		return html;
	}

    //create html for the general section
    createGeneralData(lastVisit)
	{
		try
		{
			let html = '<div class="body-section">';
			html += this.createSummary();
			html += this.createResourceList();
			html += "</div>";

			return html;
		}
		catch (error)
		{
			console.log("Error at Course.createSectionData, saying: " + error);
		}
	}
	
	// summary section inside the general tab of the course
	createSummary(lastVisit)
	{
		let text = this.description;
		let grades = this.grade_parts;
		let html = '<div class="summary-section"><h3 class="content-title">'
		+ "Summary" + '</h3><hr class="blue-hr"><h2 class="content-subtitle">Final grade: ';
		let subTitle = '';
		for(let i = 0; i < grades.length; i++) {
			subTitle += grades[i]['name'] + " ";
			if(i == grades.length - 1) {
				subTitle += "(" + grades[i]["percent"] + "%)";
			} else {
				subTitle += "(" + grades[i]['percent'] + "%), ";
			}
		}
		text = descriptionTrim(this.description, "summary","content-text" );
		html += subTitle + '</h2>'+text+'<div class="section-seperator">'+Icons.dots_seperator()+'<div class="main-dot"></div><div class="main-dot"></div><div class="main-dot"></div></div></div>';
		return html;
	}

	// resources section inside the general tab of the course
	createResourceList(lastVisit)
	{
		let html = '<div class="resources-section"><h3 class="content-title">Resources</h3><hr class="blue-hr">';
		console.log(this.resources);
		this.resources.forEach(resourceEntry => {
			for(const resourceType in resourceEntry) {
				html += '<div class="resource"><ul class="resource-list"><li class="content-subtitle"><h5 class="resource-list-item-title">' + resourceType + '</h5>';
				resourceEntry[resourceType].forEach(resourceProperties => {
					let resource = CourseResource.createFromJson(resourceProperties);
				
					html += resource.toHtml();
				});
	
				html += '</li></ul></div>';
			}
		});

		html += '</div>';

		return html;
	}

	// update section inside the updates tab of the course
	createUpdateData(lastVisit) {
		try
		{
			let html = '<div class="body-section">';
			
			for(let i = 0; i < this.updates.length; i++) {
				html += this.updates[i].toHtml(lastVisit);
				
				// if flag shown in this one, count it
				if (this.updates[i].last_html_flag_show)
				{
					this.newCounter++;
				}

				if(i != this.updates.length - 1) {
					html += '<div class="section-seperator">'+Icons.dots_seperator()+'</div>';				}
			}

			html += "</div>";

			return html;
		}
		catch (error)
		{
			console.log("Error at Course.createUpdateData, saying: " + error);
		}
	}

	// module section inside the modules tab of the course
	createModuleData(lastVisit) {
		try
		{
			let html = '<div class="body-section">';
			
			for(let i = 0; i < this.modules.length; i++) {
				html += this.modules[i].toHtml(lastVisit);

				if(i != this.modules.length - 1) {
					html += '<div class="section-seperator"><div class="main-dot"></div><div class="main-dot"></div><div class="main-dot"></div></div>';
				}
			}

			html += "</div>";

			return html;
		}
		catch (error)
		{
			console.log("Error at Course.createModuleData, saying: " + error);
		}
	}
	
	// build a list of this object from Json object
	static createListFromJson(jsonObj)
	{
		var listStudent = [];
		for (var publicationIndex = 0; publicationIndex < jsonObj.length; publicationIndex++)
		{
			listStudent.push(Course.createFromJson(jsonObj[publicationIndex]));
		}
		return listStudent;

	}
	
	// build a list of this object from Json object
	static createFromJson(jsonObj)
	{	
		return new Course(jsonObj["name"],
			jsonObj["passkey"], 
			jsonObj["description"], 
			jsonObj["code"], 
			jsonObj["year"], 
			jsonObj["semester"],
			jsonObj["university"],
			jsonObj["department"],
			jsonObj["location_class"],
			jsonObj["syllabus"],
			jsonObj["grade_parts"],
			CourseResource.createListFromJson(jsonObj["resources"]),
			CourseUpdate.createListFromJson(jsonObj["updates"]),
			CourseModule.createListFromJson(jsonObj["modules"]));

	}
}

export {Course};