import { Element } from '/js/components/element.js';

const buttonsTypes = {
    DOWNLOAD: 1,
    VIEW: 2,
    GOTO: 3,
}

class ActionButton extends Element
{
	constructor(info, type, link)
	{
		super();
		this.info = info;
		this.type = type;
		this.link = link;
	}
	
	// convert the object into HTML
	toHtml()
		{
		switch(this.type){
			case buttonsTypes.DOWNLOAD:
			// Do something for summer
			case buttonsTypes.VIEW:
			//Do something for winter
			case buttonsTypes.GOTO:
			//Do something for spring
		}
	}
	
	// build a list of this object from Json object
	static createListFromJson(jsonObj)
	{
		var answer = [];
		for (var index = 0; index < jsonObj.length; index++)
		{
			answer.push(ActionButton.createFromJson(jsonObj[index]));
		}
		return answer;
	}
	
	// build a list of this object from Json object
	static createFromJson(jsonObj)
	{
		return new ActionButton(jsonObj["info"], jsonObj["type"], jsonObj["link"]);
	}
}
export {ActionButton};