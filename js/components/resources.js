import { Element } from '/js/components/element.js';
import { ActionButton } from '/js/components/actionButton.js';
import { descriptionTrim } from '/js/descriptionSlicer.js';

let CITE_SYMBOL = '<svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5703 7.62686C12.5703 9.16849 12.5703 9.74792 11.8498 9.94165C11.3165 10.0851 10.856 10.4759 10.856 11.0282L10.856 12.8584C10.856 13.4107 11.307 13.869 11.8543 13.7953C15.0498 13.3651 16 10.7486 16 6.42653L16 1.14138C16 0.589098 15.5523 0.141382 15 0.141382L9.56874 0.141382C9.01646 0.141382 8.56874 0.589097 8.56874 1.14138L8.56874 5.42652C8.56874 5.97881 9.01646 6.42652 9.56874 6.42653L11.5703 6.42653C12.1226 6.42653 12.5703 6.87424 12.5703 7.42653L12.5703 7.62686Z" fill="#1A202C"/><path d="M2.99839 6.42653C3.55068 6.42653 3.99839 6.87424 3.99839 7.42653L3.99839 7.62686C3.99839 9.16849 3.99839 9.74792 3.27791 9.94165C2.74457 10.0851 2.28415 10.4759 2.28415 11.0282L2.28415 12.8584C2.28415 13.4107 2.7351 13.869 3.28245 13.7953C6.47777 13.3651 7.42749 10.7486 7.42749 6.42653L7.42749 1.14138C7.42749 0.589098 6.97978 0.141382 6.42749 0.141382L0.999934 0.141382C0.44765 0.141382 -6.65508e-05 0.589097 -6.65991e-05 1.14138L-6.69737e-05 5.42652C-6.7022e-05 5.97881 0.447648 6.42652 0.999933 6.42653L2.99839 6.42653Z" fill="#1A202C"/></svg>';


class Resource extends Element
{
	constructor(title, description, recommendation, fileLinks, authors, year, topic, type)
	{
		super();
		this.title = title;
		this.description = description;
		this.recommendation = recommendation;
		this.fileLinks = fileLinks;
		this.authors = authors;
		this.year = year;
		this.topic = topic;
		this.type = type;
	}

	// convert the object into HTML
	toHtml()
	{
		// 1. dynamic list of action buttons each one with it's design from the class
		// 2.

		var answer = '<div class="academic-papers-panel"><div class="personal-row-col col-reverse-mobile w-100 align-space-between"><h3>'
		+ this.title + '</h3>'
		if (this.fileLinks[0]["link"] != "")
		{
			answer += '<a class="cite-btn" onclick="copy_cite(\'' + this.title.replaceAll("'", "").replaceAll(" ", "_") + '\');">' + CITE_SYMBOL + 'Cite</a></div>';
		}
		else
		{
			answer += "</div>";
		}

		if(this.authors != "")
		{
			answer += '<h4>' + this.authors + '<br></h4>';
		}

		if(this.description != "")
		{
			answer += '<div class="card-despription-resouce">' + this.description + '</div>';
		}

		if(this.recommendation != "")
		{
			answer += descriptionTrim('<span class="recommend-promo"> Why am I recommending this? </span>' + this.recommendation);
		}

		answer += '<div class="personal-row space-between align-items-center mobile-row-breaker">';
		
		for (var i = 0; i < this.fileLinks.length; i++)
		{
			if (this.fileLinks[i]["link"] != "" && this.fileLinks[i]["type"] + "" == "1")
			{
				answer += '<a href="' + this.fileLinks[i]["link"] + '" class="download-btn acadmic-card-margin-fix">' + this.fileLinks[i]["info"] + '</a>';
			}
		}

		answer += '<div class="w-100 acadmic-parms-row"><span>'
			+ this.year + '</span><span>'
			+ this.type + '</span></div>'
			+'</div></div><input type="text" style="display: none;" id="' + this.title.replaceAll("'", "").replaceAll(" ", "_") + '" value="' + this.fileLinks[1]["link"] + '"></div></div>';
			return answer;
	}

	// build a list of this object from Json object
	static createListFromJson(jsonObj)
	{
		var answer = [];
		for (var publicationIndex = 0; publicationIndex < jsonObj.length; publicationIndex++)
		{
			answer.push(Resource.createFromJson(jsonObj[publicationIndex]));
		}
		return answer;
	}

	// build a list of this object from Json object
	static createFromJson(jsonObj)
	{
		return new Resource(jsonObj["name"],
		jsonObj["description"],
		jsonObj["recommendation"],
		ActionButton.createListFromJson(jsonObj["fileLinks"]),
		jsonObj["authors"],
		jsonObj["year"],
		jsonObj["topic"],
		jsonObj["type"]);
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
export {Resource};
