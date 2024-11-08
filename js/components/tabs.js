
class Tabs
{
    /*
		Create the tabs section
		* assumes an empty element with 'tabs' id to put the data inside it
	*/
	static createTabsSection()
	{
		try
		{

            let section = document.createElement("DIV");
            section.id = "tabs-bar";
            section.classList.add("tabs-bar");

            document.getElementById("tabs").appendChild(section);
		}
		catch(error)
		{
			console.log("Error at Tabs.createTabsSection, saying:" + error);
		}
    }

    // add a new tab to the tab bar
    /*
        @params:
        title: the title of the tab
        is_last: a boolean value if it is the last or not
        img_path: in case we want an icon in front of the title (like updates).
    */
    static addTab(title,short_title, is_last=false, img_path=null)
	{
        var img = '';
        if(img_path != null)
		{
            img = '<img src="' + img_path + '" class="new-updates-icon">'
        }

        let label = title.charAt(0).toUpperCase() + title.slice(1);
        let short_label = short_title.charAt(0).toUpperCase() + short_title.slice(1);
        let className = title.replaceAll(" ", "-") + "-bar";


        let section = document.createElement("DIV");
        section.classList.add('tab');
        section.classList.add(className);
		section.title = label.replaceAll(" ", "-");

        let html = img + '<label class="lrg-screen tab-title" title="' + label.replaceAll(" ", "-") + '">'+ label + '</label>';
        html += '<label class="sml-screen tab-title" title="' + short_label.replaceAll(" ", "-") + '">'+ short_label + '</label>';
        if(!is_last)
		{
            html += '<div class="tab-seperator"></div>';
        }

        // add toggle functionality
        section.addEventListener('click', function(event)
		{
            Tabs._activateTab(event);
        });
        section.innerHTML = html;

        document.getElementById("tabs-bar").appendChild(section);
    }

    static activateDefault(index)
	{
        const tabs = document.getElementsByClassName('tab');
        // by default toggle the first tab
        this._toggleActiveTab(tabs[index]);
        this._toggleContentDisplay(index);
    }


  static _activateTab(event)
  {
      let currTarget = event.target;
      if(currTarget.tagName == "LABEL" || currTarget.classList.contains("tab-seperator"))
        {
            currTarget = currTarget.parentNode;
        }
        if(!currTarget.classList.contains('active-tab'))
		    {
            // get the current active tab
            let currentActive = document.getElementsByClassName('active-tab')[0];

            // toggle the active class of the current active element
            Tabs._toggleActiveTab(currentActive);

            // get the index of the current active tab (=content)
            let currIndex = Array.from(currentActive.parentNode.children).indexOf(currentActive);
            Tabs._toggleContentDisplay(currIndex);

            // toggle the active class of the clicked tab
            Tabs._toggleActiveTab(currTarget);
            // get the index of the new active tab (=content)
            let newIndex = Array.from(currTarget.parentNode.children).indexOf(currTarget);
            Tabs._toggleContentDisplay(newIndex);
        }

      // update the url for sharing later this sepsific tab
      insertGetParamToUrl("section", currTarget.title);
  }

    // toggle the activeness of the given item and label
    static _toggleActiveTab(target)
	{
        // toggle the active-tab class of the given element
        target.classList.toggle('active-tab');
        // get the label element of the current active and toggle active-tab-title
        target.getElementsByTagName('label')[0].classList.toggle('active-tab-title');
        target.getElementsByTagName('label')[1].classList.toggle('active-tab-title');
    }

    // toggle the current content display
    static _toggleContentDisplay(index)
	{
        document.getElementsByClassName('body-section')[index].classList.toggle('active-section');
    }
}

export {Tabs};
