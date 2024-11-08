import { Element } from '/js/components/element.js';
import { ActionButton } from '/js/components/actionButton.js';

class passkeyPanel extends Element
{
	constructor(url, error)
	{
		super();
		this.url = url;
		this.error = error;
    }

	// convert the object into HTML
	toHtml()
	{
		var answer = '<div style="max-width: 320px; margin: 0 auto; "><p>Please enter a passkey for this page:</p><div class="input-group"><input type="hidden" id="passkey_path" value=' + this.url + '><input class="form-control py-2 border" type="password" id="passkey"><span class="input-group-append"><button id="header-search-btn" class="btn btn-outline-secondary border-left-0 border search-menu-btn" type="button" onclick="passkey();"><i class="fa fa-key"></i></button></span></div><p style="margin-top: 10px;">Do not have a passkey?<br>Feel free to <a href="mailto:lazebnik.teddy@gmail.com">send me an email</a>... </p>'
		if (this.error != "")
		{
			answer += '<p style="color: red; margin-top: 10px;">' + this.error + '</p></div>'
		}
		else
		{
			answer += "</div>"
		}
		return answer;
	}

    // build a list of this object from Json object
	static createFromJson(jsonObj)
	{
		return new passkeyPanel(jsonObj["url"]);
    }

}
export {passkeyPanel};
