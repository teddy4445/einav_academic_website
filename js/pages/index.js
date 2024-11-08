// imports 
import { PageRender, retrivedData } from '/js/pageRender.js';
import { PublicationCard } from '/js/components/publicationCard.js';
import { ProjectPanel } from '/js/components/projectPanel.js';
import { Icons } from '/js/components/icons.js';
import { addCollapseFunction, descriptionTrim } from '/js/descriptionSlicer.js';

// Data file paths
let UPDATES_TEXT = "/data/notifications.txt"
let LECTURE_INFO_JSON = "/data/jsons/lecturer.json";
let INDEX_JSON = "/data/jsons/index.json";

const notificationsArray = [];

/*
	Single instance class to build Index page with dynamic content from JSONS from the server
*/
class Index extends PageRender
{
	constructor()
	{
		
	}
	
	// just gather all the build of all the sections in the page - one per call to the server side
	static build()
	{
		Index.buildeNotifications();
		Index.buildePersonalPanel();
		Index.buildePageContent();
		
		addCollapseFunction();
	}
	
	/* build section functions */
	
	static buildeNotifications()
	{
		var container_id = "update-container";
		try
		{
			Index.loadFileFromServer(UPDATES_TEXT);
			var txtObj = retrivedData;
			var notificationLines = txtObj.split("\n");
			
			notificationsArray.push(...notificationLines);

			var notificationHtml = "";
			if (notificationLines.length > 0 && notificationLines[0] != "")
			{
				for (var notificationIndex = 0; notificationIndex < notificationLines.length; notificationIndex++)
				{
					// extract the date from the line
					var splitNotificationLine = notificationLines[notificationIndex].split(" ");
					var date = splitNotificationLine[0];
					// join the rest of the line
					var line = splitNotificationLine.slice(1).join(" ");
					
					notificationHtml += '<div class="carousel-cell"><div class="update-panel"><div class="update-text"><span class="update-date"> update ' + date + '</span><br> <span class="update-message">' + line + '</span></div></div></div>';
				}
				document.getElementById("updates-panel").innerHTML = notificationHtml;
				// slice according to window size
				// changeNotificationLength();
				
				if (notificationLines.length == 1)
				{
					setTimeout(function() 
					{
						  var flickity_button = document.getElementsByClassName("flickity-button");
						  for (var i = 0; i < flickity_button.length; i++) 
						  {
							  flickity_button[i].style.display = "none";
						  }
						  var flickity_dots = document.getElementsByClassName("flickity-page-dots");
						  for (var i = 0; i < flickity_dots.length; i++) 
						  {
							  flickity_dots[i].style.display = "none";
						  }
					}, 10);
				}
			}
			else
			{
				document.getElementById(container_id).style.display = "none";
			}
		}
		catch (error)
		{
			console.log("Error at Index.buildeNotifications saying: " + error);
			document.getElementById("update-container").style.display = "none";
		}
	}
	
	static buildePersonalPanel()
	{
		var container_id = "personal_container";
		try
		{
			Index.loadFileFromServer(LECTURE_INFO_JSON, true);
			var jsonObj = retrivedData;
			document.getElementById("lecturer-name").innerHTML = jsonObj["name"];
			document.getElementById("lecture_position").innerHTML = jsonObj["position"];
			var addressesHtml = "<div class='lecturer-info'> ";
			var addressesMobileHtml = "";
			addressesHtml += "<span>" + Icons.indexDesktopInfo() + "</span> ";
			addressesHtml += "<div class='addresses-info'> ";
			for (var locIndex = 0; locIndex < jsonObj["addresses"].length; locIndex++)
			{
				addressesHtml += "<div><p><b>"+jsonObj["addresses"][locIndex]["university"] + "</b> " + jsonObj["addresses"][locIndex]["location"] + " (" + jsonObj["addresses"][locIndex]["hours"] + ")</p></div>";					
				addressesMobileHtml += "<p><b>"+jsonObj["addresses"][locIndex]["university"] + "</b> <br>" + jsonObj["addresses"][locIndex]["location"] + " <br>Office hours:" + jsonObj["addresses"][locIndex]["hours"] + "</p>";
			}
			addressesHtml+="</div></div>"
			document.getElementById("lecture_address").innerHTML += addressesHtml;
			document.getElementById("mobile-place-data").innerHTML += addressesMobileHtml;
			document.getElementById("lecture_phone").innerHTML += jsonObj["phone"];
			document.getElementById("lecture_email").innerHTML += jsonObj["email"];
			
			// create contact icons (mail, facebook etc)
			Index.buildIconsContact(jsonObj);
			
			// mobile version click icon event 
			var infoItemBtn = document.getElementById("mobile-icon");
			infoItemBtn.addEventListener('click', function (event) 
			{
				if (document.getElementById("mobile-place-data").style.display == "block")
				{
					document.getElementById("mobile-icon").innerHTML = '<svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 3.5C11.34 3.5 3.5 11.34 3.5 21C3.5 30.66 11.34 38.5 21 38.5C30.66 38.5 38.5 30.66 38.5 21C38.5 11.34 30.66 3.5 21 3.5ZM22.75 29.75H19.25V19.25H22.75V29.75ZM22.75 15.75H19.25V12.25H22.75V15.75Z" fill="#000000"></path></svg>';	
					document.getElementById("mobile-place-data").style.display = "none";
				}
				else
				{
					document.getElementById("mobile-icon").innerHTML = '<svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 3.5C11.34 3.5 3.5 11.34 3.5 21C3.5 30.66 11.34 38.5 21 38.5C30.66 38.5 38.5 30.66 38.5 21C38.5 11.34 30.66 3.5 21 3.5ZM22.75 29.75H19.25V19.25H22.75V29.75ZM22.75 15.75H19.25V12.25H22.75V15.75Z" fill="#5A67D8"></path></svg>';	
					document.getElementById("mobile-place-data").style.display = "block";
				}
			});
		}
		catch (error)
		{
			console.log("Error at Index.buildePersonalPanel saying: " + error);
			document.getElementById(container_id).style.display = "none";
		}
	}

	static buildIconsContact(jsonObj) {
		let cv = jsonObj.cvfile;
		let email = jsonObj.email;
		let phone = jsonObj.phone;
		let linkedin = jsonObj.linkedin_link;
		let google = jsonObj.google_scholar_link;
		let facebook = jsonObj.facebook_link;
		let mobileContacts = document.getElementById("lecture_icons");
		if(cv != ""){
		  let elem_mob = document.createElement("A");
		  elem_mob.href = cv;
		  elem_mob.innerHTML = Icons.cv();
		  elem_mob.classList.add("social-icon");
		  elem_mob.classList.add("no-show-desktop");
		  mobileContacts.appendChild(elem_mob);
		}

		if(email != ""){
		   let elem_mob = document.createElement("A");
		   elem_mob.innerHTML = Icons.mail_mobile();
		   elem_mob.href = "mailto:" + email;
		   elem_mob.classList.add("social-icon");
		   elem_mob.classList.add("no-show-desktop")
		   mobileContacts.appendChild(elem_mob);
		}

		if(phone != ""){
		  let elem_mob = document.createElement("A");
		  elem_mob.innerHTML = Icons.phone();
		  elem_mob.href = "tel:" + phone;
		  elem_mob.classList.add("social-icon");
		  elem_mob.classList.add("no-show-desktop")
		  mobileContacts.appendChild(elem_mob);
		  
		}

		if(linkedin != ""){
		  let linkedinIcon = document.createElement("A");
		  linkedinIcon.innerHTML = Icons.linkedin();
		  linkedinIcon.classList.add("social-icon");
		  linkedinIcon.href = linkedin;
		  mobileContacts.appendChild(linkedinIcon);
		}

		if(google != ""){
		  let googleIcon = document.createElement("A");
		  googleIcon.innerHTML = Icons.google();
		  googleIcon.classList.add("social-icon");
		  googleIcon.href = google;
		  mobileContacts.appendChild(googleIcon);
		}

		if(facebook != ""){
			let fbIcon = document.createElement("A");
			fbIcon.innerHTML = Icons.about_facebook();
			fbIcon.classList.add("social-icon");
			fbIcon.href = facebook;
			mobileContacts.appendChild(fbIcon);
		}

	}
	
	static buildePageContent()
	{
		try
		{
			Index.loadFileFromServer(INDEX_JSON, true);
			var jsonObj = retrivedData;
			
			// Biography
			document.getElementById("biography").innerHTML = jsonObj["biography"];
			
			// Featured Publications
			var researchInterestsHtml = "";
			for (var intrestIndex = 0; intrestIndex < jsonObj["researchInterests"].length; intrestIndex++)
			{
				researchInterestsHtml += '<div class="intrest-item"><svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 10H0V12H6V10ZM8.17 6.76L6.05 4.64L4.64 6.05L6.76 8.17L8.17 6.76ZM12 0H10V6H12V0ZM17.36 6.05L15.95 4.64L13.83 6.76L15.24 8.17L17.36 6.05ZM16 10V12H22V10H16ZM11 8C9.34 8 8 9.34 8 11C8 12.66 9.34 14 11 14C12.66 14 14 12.66 14 11C14 9.34 12.66 8 11 8ZM13.83 15.24L15.95 17.36L17.36 15.95L15.24 13.83L13.83 15.24ZM4.64 15.95L6.05 17.36L8.17 15.24L6.76 13.83L4.64 15.95ZM10 22H12V16H10V22Z" fill="#323232"/></svg>' + jsonObj["researchInterests"][intrestIndex] + '</div>';
			}
			document.getElementById("research_intrests").innerHTML = researchInterestsHtml;
			
			// Featured Publications
			var featuredPublicationsHtml = "";
			for (var pubIndex = 0; pubIndex < jsonObj["featuredPublications"].length; pubIndex++)
			{
				featuredPublicationsHtml += PublicationCard.createFromJson(jsonObj["featuredPublications"][pubIndex]).toHtml();
			}
			document.getElementById("featured_publications").innerHTML = featuredPublicationsHtml;
			
			// Current Projects
			var currentProjectsHtml = "";
			for (var projIndex = 0; projIndex < jsonObj["currentProjects"].length; projIndex++)
			{
				currentProjectsHtml += ProjectPanel.createFromJson(jsonObj["currentProjects"][projIndex]).toHtml();
			}
			document.getElementById("current_projects").innerHTML = currentProjectsHtml;
			
			// egde case - no data, remove sections
			if (jsonObj["researchInterests"].length == 0)
			{
				document.getElementById("research_intrests").style.display = "none";
				document.getElementById("research_intrests_header").style.display = "none";
			}
			if (jsonObj["featuredPublications"].length == 0)
			{
				document.getElementById("featured_publications_header").style.display = "none";
			}
			if (jsonObj["currentProjects"].length == 0)
			{
				document.getElementById("current_publications_header").style.display = "none";
			}
		}
		catch (error)
		{
			console.log("Error at Index.buildePageContent saying: " + error);
		}
	}
	
	/* end -  build sections functions */
}

// run the class build on page load
Index.build();

window.addEventListener('resize', Index.buildeNotifications);

function changeNotificationLength() {
	var notifications = document.getElementsByClassName('update-message');

	for(let i = 0; i < notificationsArray.length; i++) {
		var text = notificationsArray[i];
		if(window.innerWidth >= 850) { // desktop size
			if(text.length > 200) {
				text = text.slice(0, 200) + '...\t <a id="update-link">Read More</a> ';
				notifications[i].innerHTML = text;
			}
		} else {
			if(window.innerWidth < 850) {
				if(text.length > 100) {
					text = text.slice(0, 100) + '...\t <a id="update-link">Read More</a> ';
					notifications[i].innerHTML = text;
				}
			}
			if(window.innerWidth < 470) { // phone size
				if(text.length > 30) {
					text = text.slice(0, 30) + '...\t <a id="update-link">Read More</a> ';
					notifications[i].innerHTML = text;
				}
			}
		}
	}
}

// window.addEventListener('resize', changeNotificationLength);

export { Index };
