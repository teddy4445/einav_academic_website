import { PageRender, retrivedData } from '/js/pageRender.js';
import { Course } from '/js/components/course.js';
import { passkeyPanel } from '/js/components/passkeyPanel.js';
import { Tabs } from '/js/components/tabs.js';
import { addCollapseFunction } from '/js/descriptionSlicer.js';
import { Icons } from '/js/components/icons.js';

// Data file paths
let TEACHING_JSON = "/data/jsons/teaching.json";
// consts //
let PRE_COOKIE_KEY = "course_";
let SECTIONS = ["General", "Updates", "Modules"];
// end - consts //

class CoursePage extends PageRender {
	constructor() {
		super();
		// load the data from the JSON file
		CoursePage.loadFileFromServer(TEACHING_JSON, true);

		this.data = null;

		// try to find which course page we got
		this.course_code = null;
		try {
			var getParms = PageRender.readGetPrams();
			this.course_code = getParms.get("course_id");
			this.course_password = ''+getParms.get("course_password");
		}
		catch (error) {
			// no course ID, we cannot work with this - return to teaching page so the user pick another course page
			this._redirectBack();
			return;
		}

		// find when the user last enter this page for the "new" tags
		this.last_visit = null;
		try {
			this.last_visit = new Date(getCookie(PRE_COOKIE_KEY + this.course_code));
		}
		catch (error) {
			// no cookie - first time this computer is on this page
			this.last_visit = new Date(2000, 1, 1, 0, 0, 0, 0); // very old data
		}

		// check if we wish to open some spesific tab 
		this.section_open = null;
		try {
			var getParms = PageRender.readGetPrams();
			this.section_open = getParms.get("section");
			if (this.section_open == null) {
				this.section_open = SECTIONS[0];
			}
		}
		catch (error) {
			this.section_open = SECTIONS[0];
		}

		// remember the full data
		var json_full_data = retrivedData["courses"];
		var found_course = false;
		for (var course_index = 0; course_index < json_full_data.length; course_index++) {
			if (json_full_data[course_index]["code"] == this.course_code) {
				this.data = Course.createFromJson(json_full_data[course_index]);
				found_course = true;
				break; // we find, don't run on the following
			}
		}
		if (!found_course) // if no one of the courses is the one we needed - this is an error, go to the teaching page
		{
			this._redirectBack();
		}

		// remove alert as they not in use and can make problems
		removeAlertsPanels();
	}

	build() {
		
		if ((this.data.passkey == "") || (this.data.passkey == this.course_password))
		{
			// this.buildBreadcrumb();
			this.createDetailsCourse();
			let course = this.data.toHtml(this.last_visit);
			document.getElementById('main-body-page').innerHTML = course;
			
			this.createTabsSection();
			this.pickTab();

			addCollapseFunction();

			// for the "new" tags, put new cookie with current date so we can check the needed tags next run of the page
			setCookie(PRE_COOKIE_KEY + this.course_code, new Date().toString(), 365);
		}
		else
		{
			var error = "";
			if (this.course_password != "null")
			{
				error = "Wrong passkey";
			}
			document.getElementById('main-body-page').innerHTML = new passkeyPanel(window.location.pathname + window.location.search, error).toHtml();
		}
	}

	//create html of Breadcrumb
	buildBreadcrumb() {
		try {
			var html = '<ul><li><a href="/">Home</a></li><li><a href="/teaching.html">Courses</a></li><li>' + this.data.name + '</li></ul>';
			document.getElementById("breadcrumb_section").innerHTML = html;
		}
		catch (error) {
			console.log("Error at Course.createSectionData, saying: " + error);
		}
	}

	/* helper function */

	createDetailsCourse() {

		try {
			var html = '<div class="main-header-page"><h1>'
				+ this.data.name + '</h1><div class="header-detail"><div class="item-detail"><img class="course-detail-img" src="/img/mdi_school.png"><p>'
				+ this.data.code + '</p></div><div class="item-detail"><img class="course-detail-img" src="/img/mdi_access_time.png"><p>Semester '
				+ this.data.semester + '</p></div><div class="item-detail"><img class="course-detail-img" src="/img/mdi_place.png"><div class=".personal-coloum"><p>'
				+ this.data.university + '</p><p>'
				+ this.data.location_class + '</p></div></div></div><div class="personal-row">';

			if (this.data.syllabus != "" && this.data.syllabus != undefined) {
				html += '<a class="sylabus-link" href=' + this.data.syllabus + ' ><img class="course-sylabus-img" src="/img/save_alt.png" alt="">Syllabus</a>';
			}
			html += '</div></div>';

			//mobile version
			html += '<div class="main-header-page-mobile"><h1>' + this.data.name + '</h1>' +
				'<div class="header-detail">' +
				'<div id="education" class="item-detail-mobile">' + Icons.education_hat() + '</div>' +
				'<div id="place" class="item-detail-mobile">' + Icons.location() + '</div>' +
				'<div id="hours" class="item-detail-mobile">' + Icons.course_clock() + '</div>' +
				'</div>';

			html += this.setUpperDataPanel() + '</div>';

			//add to document
			document.getElementById("icons_section").innerHTML = html;
			//set click function for each icon
			this.setClickForIcon();
		}
		catch (error) {
			console.log("Error at Course.BuildHeader, saying:" + error);
		}
	}


	//set the event-click for each icon to change color and show-hide panel
	setClickForIcon() {
		var items = document.getElementsByClassName('item-detail-mobile');
		//for each item detail-set click function
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			item.addEventListener('click', function (event) {
				var iconElemns = event.currentTarget.children[0].children;//path elemnt(child of svg)
				var iconElemntId = event.currentTarget.id;
				//if current element is not the one active, remove the active(if exsist)
				if (!iconElemns[0].classList.contains("active-icon")) {
					//remove active item
					let currentActive = document.getElementsByClassName('active-icon');
					while (currentActive.length)//is there is no active elemnt-length is 0
						currentActive[0].classList.toggle("active-icon");//the list get smaller as we remove
					//hise the acitve panel
					let currentPanel = document.getElementsByClassName('active-icon-panel');
					if (currentPanel.length)
						currentPanel[0].classList.toggle("active-icon-panel");
				}
				//acitve/de-active the icon elemnt.
				for (let j = 0; j < iconElemns.length; j++) {
					iconElemns[j].classList.toggle("active-icon");
				}
				//toggle the of element panel
				document.getElementById(iconElemntId + "-data").classList.toggle("active-icon-panel");
			});
		}
	}

	//add panels of basic info about the course
	setUpperDataPanel() {
		//add educatio panel
		let html = '<div id="education-data" class="icon-detail-panel">Course number: ' + this.data.code;
		if (this.data.syllabus != "" && this.data.syllabus != undefined) {
			html += '<br><a class="sylabus-link" href=' + this.data.syllabus + ' ><img class="course-sylabus-img" src="/img//mdi_insert_drive_file.png" alt="">Download course syllabus</a>';
		}
		//add class place panel
		html += '</div><div id="place-data" class="icon-detail-panel">'
			+ this.data.university +
			'<br>'
			+ this.data.location_class + '</div>';
		//add time panel
		html += '<div id="hours-data" class="icon-detail-panel"> Semester ' + this.data.semester + '</div>';
		return html;
	}


	createTabsSection() {
		Tabs.createTabsSection();
		Tabs.addTab('general', 'general');
		if (this.data.updates.length > 0) {
			Tabs.addTab('updates', 'updates', false, this._pick_flag());
		}
		Tabs.addTab('modules', 'modules', true);

	}

	pickTab() {
		for (var sectionIndex = 0; sectionIndex < SECTIONS.length; sectionIndex++) {
			if (this.section_open == SECTIONS[sectionIndex]) {
				Tabs.activateDefault(sectionIndex);
				return;
			}
		}
		Tabs.activateDefault(0); // default case;
	}



	// help functions //

	// pick the needed flag icon
	_pick_flag() {
		if (this.data.newCounter == 0) {

		}
		else if (this.data.newCounter < 10) {
			return "/img/flags/flag" + this.data.newCounter + ".png";
		}
		else {
			return "/img/flags/flag+.png";
		}
	}

	// check if we need the new icon or not, if we do - just give the HTML
	_addNewTagIfNeeded(resourceDate) {
		if (resourceDate > this.last_visit) {
			return '<img src="./img/new-resource.png" class="new-resource-icon" />';
		}
		return ""; // if we don't need to - just return empty string into the html
	}

	// redicrect to the teaching page
	_redirectBack() {
		window.location.replace(window.location.hostname + "/teaching.html");
	}

	// end - help functions //
}

// run the class build on page load
document.coursePage = new CoursePage();
document.coursePage.build();

export { CoursePage }
