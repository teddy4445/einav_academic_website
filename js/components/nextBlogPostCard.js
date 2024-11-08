import { Element } from '/js/components/element.js';
import { ActionButton } from '/js/components/actionButton.js';

const MAX_DESC_LENGTH = 150;

class NextBlogPostCard extends Element
{
	constructor(title, date, reading_time, description, link_address)
	{
		super();
		this.title = title;
		this.date = date;
		this.reading_time = reading_time;
		this.description = description;
		this.link_address = link_address;
	}

	// convert the object into HTML
	toHtml()
	{
		let final_desc = this.description;
		if (final_desc.length > MAX_DESC_LENGTH)
		{
			final_desc = final_desc.substring(0, MAX_DESC_LENGTH) + "...";
		}
		var answer = '<div class="academic-papers-panel next-blog-card-size"><div class="personal-col w-100 next-post-box-title"><h3>' 
		+ this.title + '</h3>' + "<div class='meta-blog-next-post-time-element meta-blog-post-title'>" + this.date + " &#9679; " + this.reading_time + " minutes to read </div><h5>" +
		final_desc + '</h5><div class="w-100 flex-end align-items-center mobile-row-spacer"><a href="/blog-post.html?post=' + this.link_address + '" class="download-btn">Read More</a></div></div></div>';
		return answer;
	}
	

	// build a list of this object from Json object
	static createListFromJson(jsonObj)
	{
		var answer = [];
		for (var nextBlogPostIndex = 0; nextBlogPostIndex < jsonObj.length; nextBlogPostIndex++)
		{
			answer.push(NextBlogPostCard.createFromJson(jsonObj[nextBlogPostIndex]));
		}
		return answer;
	}

	// build a list of this object from Json object
	static createFromJson(jsonObj)
	{
		return new NextBlogPostCard(jsonObj["title"],
		jsonObj["date"],
		jsonObj["reading_time"],
		jsonObj["description"],
		jsonObj["link_address"]);
	}
}
export {NextBlogPostCard};
