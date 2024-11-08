class Element
{
	constructor()
	{
		
	}
	
	// convert the object into HTML
	toHtml()
	{
		throw new NotImplemented("BuildtoHtml");
	}
	
	// build a list of this object from Json object
	static createListFromJson(jsonObj)
	{
		throw new NotImplemented("createListFromJson");
	}
	
	// build a list of this object from Json object
	static createFromJson(jsonObj)
	{
		throw new NotImplemented("createFromJson");
	}
}
export {Element};