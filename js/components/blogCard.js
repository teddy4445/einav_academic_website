import { Element } from '/js/components/element.js';
import { ActionButton } from '/js/components/actionButton.js';

class BlogCard extends Element
{
	constructor(title, description, year, month, day, fileLinks, order)
	{
		super();
		this.title = title;
		this.description = description;
		this.year = year;
		this.month = month;
		this.day = day;
		this.fileLinks = fileLinks;
		this.order = order;
	}
	
	// convert the object into HTML
	toHtml()
	{
		//TODO: change it to the relevant HTML
		
		var answer = '<div class="academic-papers-panel"><h3 class="blog-title">' 
		+ this.title + '</h3><p>'
		+ this.description + '</p><div class="personal-row space-between align-items-center mobile-row-breaker"><div class="w-100"><span class="blog-data">'
		+ this.day + "/" + this.month + "/" + this.year +  '</span></div><div class="w-100 flex-end align-items-center mobile-row-spacer"><a href="/blog-post.html?post='
		+ this.fileLinks[0]["link"] + '" class="download-btn">Read More</a></div></div></div>';
		return answer;
	}
	
	// build a list of this object from Json object
	static createListFromJson(jsonObj)
	{
		var answer = [];
		for (var publicationIndex = 0; publicationIndex < jsonObj.length; publicationIndex++)
		{
			answer.push(BlogCard.createFromJson(jsonObj[publicationIndex]));
		}
		return answer;
	}
	
	// build a list of this object from Json object
	static createFromJson(jsonObj)
	{
		return new BlogCard(jsonObj["title"],
		jsonObj["description"], 
		jsonObj["year"], 
		jsonObj["month"], 
		jsonObj["day"], 
		jsonObj["fileLinks"],
		jsonObj["order"]);
	}
	
	// sort according to some property list of this object
	static sortByProperty(ObjList, property)
	{
		return ObjList.sort(function(a, b)
		{
			var x = a[property + ""]; 
			var y = b[property + ""];
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
	}
	
	// filter the list according to some property and value
	static filterList(objList, property, filterValue)
	{
		var answer = [];
		for (var objIndex = 0; objIndex < objList.length; objIndex++)
		{
			if (objList[objIndex][property + ""] == filterValue)
			{
				answer.push(objList[objIndex]);
			}
		}
		return answer;
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
export {BlogCard};