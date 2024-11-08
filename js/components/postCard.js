import { Element } from '/js/components/element.js';

class PostCard extends Element
{
	constructor(title, link_post, year)
	{
		super();
		this.title=title;
		this.link_post=link_post;
		this.year=year;
	}
	
	// convert the object into HTML
	toHtml()
	{
		var answer = '<div class="post-card"><h3>' 
        + this.title +'</h3><button onclick="location.href='
        + this.linked_link +'" type="button">story</button>'
		return answer
	}
	
	// build a list of this object from Json object
	static createListFromJson(jsonObj)
	{
		var listPosts = [];
		for (var postIndex = 0; postIndex < jsonObj.length; postIndex++)
		{
			listPosts.push(PostCard.createFromJson(jsonObj[postIndex]));
		}
		return listPosts;

	}
	
	// build a list of this object from Json object
	static createFromJson(jsonObj)
	{

		return new PostCard(jsonObj["title"],
		jsonObj["link_post"], 
		jsonObj["year"],);

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
}
export {PostCard};