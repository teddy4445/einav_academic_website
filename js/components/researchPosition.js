import { Element } from '/js/components/element.js';

class ResearchPosition extends Element
{
	constructor(name, description, requierments, applay_text, position_type, connect_email)
	{
		super();
		this.name = name;
		this.description = description;
		this.requierments = requierments;
		this.applay_text = applay_text;
		this.position_type = position_type;
		this.connect_email = connect_email;
	}
	
	// convert the object into HTML
	toHtml()
	{
		let html = '<div class="research">';
		
		// header
		html += '<div class="research-title space-between"><h3 class="content-title">' + this.name + '</h3><p class="position-type research-duration">' + this.position_type + '</p></div><hr class="blue-hr">';
		// about this position
		html += '<div class="team-section"><div class="collapsing-section-title"><div class="team-title space-between"><p class="content-subtitle">About this position</p><svg class="moreLessButton" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 13 8" width="13" height="8">'+
		'</div><hr></div><div class="about-position-section collapsing-section open-section">' + this.description + '</div></div>';
		// requierments
		if (this.requierments.length > 0)
		{
			html += '<div class="team-section"><div class="collapsing-section-title"><div class="team-title space-between"><p class="content-subtitle content-subtitle-position">Requirements</p><svg class="moreLessButton" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 13 8" width="13" height="8">'+
			'</div><hr class="position-hr-mobile"></div><div class="position-info req-content-section collapsing-section open-section"><ul class="research-requierment-list">';

			this.requierments.forEach(requierment => {
				html += '<li>' + requierment + '</li>';
			});
			
			// end of requierments section + end of whole requierments section
			html += '</ul></div></div>';
		}
		
		// how to applay
		if (!(this.applay_text == "" || this.connect_email == ""))
		{
			html += '<div class="team-section"><div class="collapsing-section-title"><div class="team-title space-between"><p class="content-subtitle content-subtitle-position">How to applay</p><svg class="moreLessButton" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 13 8" width="13" height="8">'+
			'</div><hr class="position-hr-mobile"></div><div class="apply-position-section collapsing-section open-section  col-important">';
			
			if (this.applay_text != "")
			{
				html += '<p class="applay-position-text">' + this.applay_text + '<p><div class="reachout"><svg style="margin-right: 5px;" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4.5H4.00002C2.90002 4.5 2.01002 5.4 2.01002 6.5L2.00002 18.5C2.00002 19.6 2.90002 20.5 4.00002 20.5H20C21.1 20.5 22 19.6 22 18.5V6.5C22 5.4 21.1 4.5 20 4.5ZM20 8.5L12 13.5L4.00002 8.5V6.5L12 11.5L20 6.5V8.5Z" fill="#5A67D8"/></svg> Reach out to <a href="mailto:' + this.connect_email + '" title="Contact email">' + this.connect_email + '</a></div>'; 
			}
			
			// end of applay section + end of whole applay section
			html += '</div></div>';
		}
		// close component
		html += '</div>';
		
		return html;
	}
	
	// build a list of this object from Json object
	static createListFromJson(jsonObj)
	{
		var answer = [];
		for (var publicationIndex = 0; publicationIndex < jsonObj.length; publicationIndex++)
		{
			answer.push(ResearchPosition.createFromJson(jsonObj[publicationIndex]));
		}
		return answer;
	}
	
	// build a list of this object from Json object
	static createFromJson(jsonObj)
	{	
		var requierments = [];
		for (var requierment_index = 0; requierment_index < jsonObj["requierments"].length; requierment_index++)
		{
			requierments.push(jsonObj["requierments"][requierment_index]);
		}
		
		return new ResearchPosition(jsonObj["name"],
			jsonObj["description"],
			requierments,
			jsonObj["applay_text"], 
			jsonObj["position_type"], 
			jsonObj["connect_email"]);
	}
}
export {ResearchPosition};