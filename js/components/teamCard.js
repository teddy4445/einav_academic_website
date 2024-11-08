import { Element } from '/js/components/element.js';
import { ActionButton } from '/js/components/actionButton.js';

class TeamCard extends Element
{
	constructor(name, title, description, s_date, e_date, image_link, info_link, category_name, order)
	{
		super();
		this.name = name;
		this.title = title;
		this.description = description;
		this.s_date = s_date;
		this.e_date = e_date;
		this.image_link = image_link;
		this.info_link = info_link;
		this.category_name = category_name;
		this.order = order;
	}
	
	// convert the object into HTML
	toHtml()
	{
		var answer = '<div class="academic-papers-panel"><div class="row"><div class="col-lg-8 col-md-8 col-sm-12"><h2 class="blog-title">' 
		+ this.name + '</h2><h3 class="blog-title-second">' 
		+ this.title + ' (' + this.category_name + ')' + '</h3><span class="blog-data">'
		+ this.s_date + " - " + this.e_date +  '</span><p class="member-disc"><br>'
		+ this.description + '</p><a href="'
		+ this.info_link + '" class="download-btn member-link-btn">Learn more</a></div><div class="col-lg-4 col-md-4 col-sm-12 img-delete-mobile member-div-image"><img src="/' 
		+ this.image_link + '" alt="Lab member\'s image" /> </div></div></div></div>';
		return answer;
	}
	
	// build a list of this object from Json object
	static createListFromJson(jsonObj)
	{
		var answer = [];
		for (var publicationIndex = 0; publicationIndex < jsonObj.length; publicationIndex++)
		{
			answer.push(TeamCard.createFromJson(jsonObj[publicationIndex]));
		}
		return answer;
	}
	
	// build a list of this object from Json object
	static createFromJson(jsonObj)
	{
		return new TeamCard(jsonObj["name"],
		jsonObj["title"],
		jsonObj["description"], 
		jsonObj["s_date"], 
		jsonObj["e_date"], 
		jsonObj["image_link"], 
		jsonObj["info_link"], 
		jsonObj["category_name"],
		jsonObj["order"]);
	}
	
	// sort according to some property list of this object
	static sortByProperty(ObjList, property)
	{
		return ObjList.sort(function(a, b)
		{
			var x = a[property + ""]; 
			var y = b[property + ""];
			return ((x > y) ? -1 : ((x < y) ? 1 : 0));
		});
	}
	
}
export {TeamCard};