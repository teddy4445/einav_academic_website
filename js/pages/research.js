// imports
import { PageRender, retrivedData } from '/js/pageRender.js';
import { ResearchProject } from '/js/components/researchProject.js';
import { ResearchPosition } from '/js/components/researchPosition.js';
import { Icons } from '/js/components/icons.js';
import { Tabs } from '/js/components/tabs.js';
import { addCollapseFunction } from '/js/descriptionSlicer.js';

// Data file paths
let RESEARCH_JSON = "/data/jsons/research.json";
let SECTIONS = ["Ongoing-Projects", "Previous-Projects", "Work-with-me"];

/*
	Single instance class to build about page with dynamic content from JSONS from the server
*/
class Research extends PageRender
{
	constructor()
	{
        super();
		this.section_open = null;
		try
		{
			var getParms = PageRender.readGetPrams();
			this.section_open = getParms.get("section");
			if (this.section_open == null)
			{
				this.section_open = SECTIONS[0];
			}
		}
		catch (error)
		{
			this.section_open = SECTIONS[0];
		}
		
		Research.loadFileFromServer(RESEARCH_JSON, true);
		this.jsonData = retrivedData;
		
		
		// get now date to split ongoing and previous projects
		var nowDate = new Date();
		
		this.ongoingProjects = [];
		this.previousProjects = [];
		for (var index = 0; index < this.jsonData["projects"].length; index++)
		{
			var newProject = ResearchProject.createFromJson(this.jsonData["projects"][index]);
			//create lists of current and prev researches using date calculation.
			if ((newProject.end_year < nowDate.getFullYear()) || 
				(newProject.end_year == nowDate.getFullYear() && newProject.end_month <= nowDate.getMonth() + 1))
			{
				this.previousProjects.push(newProject);
			}
			else
			{
				this.ongoingProjects.push(newProject);
			}
		}
		
		this.openPositions = [];
		for (var index = 0; index < this.jsonData["open_positions"].length; index++)
		{
			this.openPositions.push(ResearchPosition.createFromJson(this.jsonData["open_positions"][index]));
		}
		
		// remove alert as they not in use and can make problems
		removeAlertsPanels();
	}

	// just gather all the build of all the sections in the page - one per call to the server side
	build()
	{
		this.createTabsSection();
		
		// build the tabs' data and open the needed tab according to the link
		let tabsHTML = "";
		tabsHTML += this.buildOngoing();
		tabsHTML += this.buildPrevious();
		tabsHTML += this.buildWorkwithme();
		document.getElementById('main-body-page').innerHTML += tabsHTML;
		
		// open the right tab according to the url
		this.pickTab();

		this._addCollapsonigSections();
		addCollapseFunction()
	}

	createTabsSection() {
		Tabs.createTabsSection();
		Tabs.addTab('Ongoing Projects', 'Ongoing');
		Tabs.addTab('Previous Projects', 'Previous');
		Tabs.addTab('Work with me','Join me', true);
	}

	buildOngoing()
	{
		let answerHTML = '<div class="body-section">';

		this.ongoingProjects.forEach((research, i) => {
			answerHTML += research.toHtml();

			if(i < this.ongoingProjects.length - 1) {
				answerHTML += '<div class="section-seperator">'+Icons.dots_seperator()+'</div>';
			}
		});

		answerHTML += '</div>';
		return answerHTML;
	}
	
	buildPrevious()
	{
		let answerHTML = '<div class="body-section">';

		this.previousProjects.forEach((research, i) => {
			answerHTML += research.toHtml();

			if(i < this.previousProjects.length - 1) {
				answerHTML += '<div class="section-seperator">'+Icons.dots_seperator()+'</div>';
			}
		});
		
		answerHTML += '</div>';
		return answerHTML;
	}
	
	buildWorkwithme()
	{
		let answerHTML = '<div class="body-section">';
		
		if (this.jsonData["work_with_me_opening"] != "")
		{
			answerHTML += '<div class="opening-statment">' + this.jsonData["work_with_me_opening"] + '</div>';	
		}

		this.openPositions.forEach((position, i) => {
			answerHTML += position.toHtml();

			if(i < this.openPositions.length - 1) {
				answerHTML += '<div class="section-seperator">'+Icons.dots_seperator()+'</div>';
			}
		});
		
		answerHTML += '</div>';
		return answerHTML;
	}
	
	pickTab()
	{
		for (var sectionIndex = 0; sectionIndex < SECTIONS.length; sectionIndex++)
		{
			if (this.section_open == SECTIONS[sectionIndex])
			{
				Tabs.activateDefault(sectionIndex);
				return;
			}
		}
		Tabs.activateDefault(0); // default case;
	}

	_addCollapsonigSections() {
		let sections = document.getElementsByClassName("collapsing-section-title");

		for(let i = 0; i < sections.length; i++) {
			sections[i].addEventListener('click', function(event) {
				event.target.parentElement.nextSibling.classList.toggle('open-section');

				sections[i].getElementsByClassName('moreLessButton')[0].classList.toggle('flip180');
			});
		}
	}
}

document.researchPage = new Research();
document.researchPage.build();

export {Research};
