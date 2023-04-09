let menu = document.querySelector('#side-menu');
let root = document.querySelector(':root');
let sideBar = document.querySelector('.side-bar');
let box = document.querySelector('.gallery .box');
let sideBarbox = document.querySelectorAll('.side-bar .box');
let sideBarbox22 = document.querySelector('.side-bar #signinfirst_box22');
let storam_container = document.querySelector('.gallery .storam-container');
let settings = document.querySelector('#settings');
window.onload = handleClientLoad;
const element = document.getElementById("id01");

var gdapifiles;
const CLIENT_ID = '834163430589-jh3iga52i4timnnr98m9h3haldpd4kc3.apps.googleusercontent.com'
const CLIENT_SECRET = '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';
const API_KEY = 'AIzaSyBLQtLrvXHtD8L2ff1Wj1IYsHOmbRKNYOQ';
const SCOPES = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/calendar.readonly';
const DRIVE_ID = '1SQ8ekSOyQkJQPNchWY5efs3gZuCsou8D';

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient(){
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
        driveId: DRIVE_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        plugin_name: "Stotram Test APP"
    }).then(function(){
        loadClient().then(execute);
    }, function(error) {
        console.error(error);
    });
}

function loadClient() {
    gapi.client.setApiKey("AIzaSyDQWQ3k9RseWsE8aOEl2r5MnocolaTclSY");
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/drive/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); });
}

var listContainer = document.querySelector('.storam-container ul');
var folderContainer = document.querySelector('.category');

function clearList() {
    listContainer.innerHTML = ' ';
}
function searchfolder() {
    return gapi.client.drive.files.list({
        includeItemsFromAllDrives: true,
        includeTeamDriveItems: false,
        supportsAllDrives: true,
        supportsTeamDrives: false,
        q: `'1SQ8ekSOyQkJQPNchWY5efs3gZuCsou8D' in parents and mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id, name)'
    }).then(function(response){
        console.log("RESPONSE", response);
        displayFolders(response);
    }), 
    function(err) { console.error("Execute error", err); };
}

function execute() {
    return gapi.client.drive.files.list({
        includeItemsFromAllDrives: true,
        includeTeamDriveItems: false,
        supportsAllDrives: true,
        supportsTeamDrives: false,
        'q': "mimeType='application/pdf' and '1SQ8ekSOyQkJQPNchWY5efs3gZuCsou8D' in parents",
        fields: 'files(id, name, webViewLink)'
    })
    .then(function(response) {
        result = response;
        displayFiles(result); 
        const gallery = document.getElementsByClassName('gallery');
        errorMessage.style.display = 'none';
        document.getElementById("loader").style.display = "none";
        document.getElementById('side-menu').style.display = "block";
        searchfolder();
        showsideBar();
        for (let i = 0; i < gallery.length; i++) {
            gallery[i].style.display = "block";
        }
        console.log("Response", response);
    },
    function(err) { console.error("Execute error", err); });
}

const TIME_LIMIT = 5000; // 10 seconds
const loader = document.getElementById("loader");
const errorMessage = document.getElementById('message');

const timer = setTimeout(function() {
    // Check if the user is online
    if (navigator.onLine) {
        console.log("Hello!");

        // Check the type of connection
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const type = connection.effectiveType;

        console.log(`Connection type: ${type}`);

        // Check the downlink speed
        const downlink = connection.downlink;

        if (downlink >= 10) {
            console.log("5G or faster");
        } else if (downlink >= 1.5) {
            console.log("4G");
        } else if (downlink >= 0.384) {
            console.log("3G");
            errorMessage.innerHTML = "Your connection is slow, so some actions may take longer than usual. Please try to connect to a faster network if possible, or wait for it to load complete.";
            errorMessage.style.display = 'block';
        } else {
            console.log("Less than 3G");
            errorMessage.innerHTML = "Your connection is really slow, so some actions may take longer than usual. Please try to connect to a faster network if possible, or wait for it to load complete.";
            errorMessage.style.display = 'block';
        }
    } else {
        // Display a message indicating that the user needs to be online
        if(isIOS){
            loader.style.display = 'none';
        } else {
            loader.style.display = 'none';
            errorMessage.style.top = 'calc(50%)';
            errorMessage.style.display = 'block';
        }
    }
}, TIME_LIMIT);

loader.addEventListener("load", function() {
    clearTimeout(timer);
});

function displayFiles(response, clear=true) {
    // Handle the results here (response.result has the parsed body).
    gdapifiles = response.result.files;
    if(gdapifiles && gdapifiles.length > 0){
        if(clear)
            listContainer.innerHTML = '';
        for(var i=0; i < gdapifiles.length; i++){
            listContainer.innerHTML += `
            <li data-id="${gdapifiles[i].id}" data-name="${gdapifiles[i].id}">
            <span>
                <a class="typing-effect" href="${gdapifiles[i].webViewLink}">${gdapifiles[i].name.split(".pdf")[0]}</a>           
                </span>
                </li>
                `;
            } 
        } else {
            listContainer.innerHTML = '<div style="text-align: center;color: black;">No Files</div>'
            console.log(gdapifiles, gdapifiles.length);
        }
}

let categoryBtn2;

function displayFolders(response, clear=true) {
    // Handle the results here (response.result has the parsed body).
    var gdapifolders = response.result.files;
    if(gdapifolders && gdapifolders.length > 0){
        if(clear)
        folderContainer.innerHTML = '';

        let promises = [];
        
        for (var i = 0; i < gdapifolders.length; i++) {
            promises.push(gapi.client.drive.files.list({
                includeItemsFromAllDrives: true,
                supportsAllDrives: true,
                q: `mimeType='image/jpeg' and "${gdapifolders[i].id}" in parents`,
                fields: 'files(name)'
            }).then(function (response) {
                if (response && response.result && response.result.files.length > 0) {
                    return `<img src="${response.result.files[0].name}"/>`;
                } else {
                    return '';
                }
            }));
            
            folderContainer.innerHTML += `
            <div data-category="${gdapifolders[i].name}" class="btn">${gdapifolders[i].name}</div>
            `;
            
            map1.set(gdapifolders[i].name, gdapifolders[i].id);
            }

            Promise.all(promises).then(function(imageTags) {
                for (var i = 0; i < gdapifolders.length; i++) {
                    document.querySelector(`[data-category="${gdapifolders[i].name}"]`).innerHTML = `${imageTags[i]}${gdapifolders[i].name}`;
                }
            });                                                 
            
        categoryBtn2 = document.querySelectorAll('.category .btn');

        categoryBtn2.forEach(btn =>{
            btn.onclick = () => {
                categoryBtn2.forEach(remove => remove.classList.remove('active'));
                btn.classList.add('active');
                dataCata = btn.getAttribute('data-category');
                if(dataLang != null){
                    scrollToArrow();
                }
            }
        });

    } else {
        folderContainer.innerHTML = '<div style="text-align: center;color: black;">No Categories Found!</div>'
    }
}

function scrollToArrow() {
    document.getElementById("arrow-right").scrollIntoView({ behavior: 'smooth' });
}
const map1 = new Map([
    ['Bhagavad Geeta', '1zxN8U4BkDdcWkG65FS5IvIuzJ_TsEGcp']
]);

let previousSearchValue = "";

function debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    }
}

const calendarId = "19e70d47ebd9369eba23e2b8ddbf14fccbe7265917e770bf15e4d389f496c888@group.calendar.google.com";
const now = new Date().toISOString();
const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${API_KEY}`;

const calendarDiv = document.querySelector('.calendar');
function fetchcalendar() {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const now = new Date().toISOString();
        const events = data.items.filter(event => {
          const endDate = new Date(event.end.dateTime || event.end.date);
          return endDate >= new Date(now);
        }).slice(0, 5);
  
        var html = '<table>';
        html += '<tr><th>Event</th><th>Date</th><th>Time</th><th>Description</th></tr>';
  
        if (events.length > 0) {
          for (var i = 0; i < events.length; i++) {
            var event = events[i];
            const startDate = new Date(event.start.dateTime || event.start.date);
            const endDate = new Date(event.end.dateTime || event.end.date);
            const eventDate = startDate.toLocaleDateString();
            const eventTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            var eventDescription = event.description;
            if (eventDescription.includes('RSVP')) {
                if (eventDescription.includes('href')){
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(eventDescription, 'text/html');
                    const url = doc.querySelector('a').getAttribute('href');
                    eventDescription = event.description ? (event.description.includes('http') ? `<a class="type" href="${url}">RSVP</a>` : event.description) : '';
                } else {
                    eventDescription = event.description ? (event.description.includes('http') ? `<a class="type" href="${event.description.substring(5)}">RSVP</a>` : event.description) : '';
                }
            } else {
                // Replace "RSVP" with "Link" in eventDescription
                if (eventDescription.includes("href")){
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(eventDescription, 'text/html');
                    const url = doc.querySelector('a').getAttribute('href');
                    eventDescription = event.description ? (event.description.includes('http') ? `<a class="type" href="${url}">LINK</a>` : event.description) : '';
                } else {
                    eventDescription = event.description ? (event.description.includes('http') ? `<a class="type" href="${event.description}">LINK</a>` : event.description) : '';
                }
            }
              
            if (endDate >= new Date(now)) {
              html += '<tr>';
              html += '<td>' + event.summary + '</td>';
              html += '<td>' + eventDate + '</td>';
              html += '<td>' + eventTime + '</td>';
              html += '<td>' + eventDescription + '</td>';
              html += '</tr>';
            }
          }
          html += '</table>';
          calendarDiv.innerHTML = html;
        } else {
          calendarDiv.innerHTML = 'No Events Found';
        }
      })
      .catch(error => console.error(error));
}  

function searchfiles() {
    count=0;
    document.querySelector('#search-box').oninput = debounce(() => {
        var searchvalue = document.querySelector('#search-box').value.toString().trim();
        console.log("searchvalue=%s", searchvalue);
        dataCata = null;
        dataLang = null;
        previousButton.style.display = "none";
        nextButton.style.display = "none";
        searchvalue = DOMPurify.sanitize(searchvalue);
    
        document.getElementById("loader").style.display = "block";

        searchInFolder(searchvalue);
        
        element.innerHTML = `Search: ${searchvalue}`;
    }, 200);
}

function searchInFolder(searchvalue) {
    if (!/^[a-z0-9\- ]+$/i.test(searchvalue)) {
        clearList();
        listContainer.innerHTML = '<div style="text-align: center;">Search with only alphanumeric characters</div>'
        element.innerHTML = `Search Stotram: `;
        document.getElementById("loader").style.display = "none";
        langBtn.forEach(remove => remove.classList.remove('active'));
        categoryBtn2.forEach(remove => remove.classList.remove('active'));
        return;
    }
    var promises = []
    for (let [folderName, folderId] of map1.entries()) {
        promises.push(gapi.client.drive.files.list({
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
            q: `mimeType='application/pdf' and name contains "${searchvalue}" and "${folderId}" in parents`, 
            fields: 'files(id, name, webViewLink)'
        }))
    }
    Promise.all(promises.map(p => p.then(r => r))).then(function(responses) {
        if(searchvalue.length <= 2) {
            clearList();
            listContainer.innerHTML = '<div style="text-align: center;">Search for 3 or more letters</div>'
            element.innerHTML = `Search Stotram: `;
            document.getElementById("loader").style.display = "none";
            langBtn.forEach(remove => remove.classList.remove('active'));
            categoryBtn2.forEach(remove => remove.classList.remove('active'));
        } else {
            currentFiles = responses.reduce((allFiles, currentFiles) => allFiles.concat(currentFiles.result.files), []);
            if(currentFiles.length > 5) {
                currentPage = 0;
                previousButton.style.display = "inline-block";
                nextButton.style.display = "inline-block";
            }
            displayCurrentPage();
            langBtn.forEach(remove => remove.classList.remove('active'));
            categoryBtn2.forEach(remove => remove.classList.remove('active'));
            document.getElementById("loader").style.display = "none";
        }                        
    });
}

function showsideBar() {
    menu.classList.toggle('hidden');
    sideBar.classList.toggle('active');
    box.classList.toggle('active');
    storam_container.classList.toggle('active');
}

menu.onclick = () => {
    showsideBar();
    previousButton.style.display = "none";
    nextButton.style.display = "none";
};

let resultmain = document.querySelector('.Results');

const PAGE_SIZE = 5;
let currentPage = 0;
let currentFiles = [];

resultmain.onclick = () => {
    if (dataCata == null && dataLang == null) {
        sideBar.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        return;
    }
    
    let dataCataID = map1.get(dataCata);
    let query;
    
    if (!dataCataID) {
        var promises = []
        for (let [folderName, folderId] of map1.entries()) {
            promises.push(gapi.client.drive.files.list({
                includeItemsFromAllDrives: true,
                supportsAllDrives: true,
                q: `mimeType='application/pdf' and name contains "${dataLang}" and "${folderId}" in parents`, 
                fields: 'files(id, name, webViewLink)'
            }))
        }
        Promise.all(promises.map(p => p.then(r => r))).then(function(responses) {
            currentFiles = responses.reduce((allFiles, currentFiles) => allFiles.concat(currentFiles.result.files), []);
            if(currentFiles.length > 5) {
                currentPage = 0;
                previousButton.style.display = "inline-block";
                nextButton.style.display = "inline-block";
            }
            displayCurrentPage();
            element.innerHTML = `Search: ${dataLang}`;
            showsideBar();             
        });
    } else {
        query = `mimeType='application/pdf' and "${dataCataID}" in parents`;
        if (dataLang != null) {
            query += ` and name contains "${dataLang}"`;
        }
        
        if (dataCata != null) {
            let searchLabel = dataLang ? `${dataLang} and ${dataCata}` : `${dataCata}`;
            element.innerHTML = `Search: ${searchLabel}`;
        }
        
        let promises = [];
        promises.push(gapi.client.drive.files.list({
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
            q: query,
            fields: 'files(id, name, webViewLink)',
        }));
        Promise.all(promises.map(p => p.then(r => r))).then(function(responses) {
            currentFiles = responses.reduce((allFiles, currentFiles) => allFiles.concat(currentFiles.result.files), []);
            if(currentFiles.length > 5) {
                currentPage = 0;
                previousButton.style.display = "inline-block";
                nextButton.style.display = "inline-block";
            }
            displayCurrentPage();
            showsideBar();
        }).catch(function (err) {
            console.error("Execute error", err);
            clearList();
        });        
    }
};

function displayCurrentPage() {
    const startIndex = currentPage * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const filesToDisplay = currentFiles.slice(startIndex, endIndex);
    displayFiles({ result: { files: filesToDisplay } });

    if ((currentPage + 1) * PAGE_SIZE >= currentFiles.length) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
    
    if (currentPage == 0) {
        previousButton.disabled = true;
    } else {
        previousButton.disabled = false;
    }
}

function goToPreviousPage() {
    if (currentPage > 0) {
        currentPage--;
        displayCurrentPage();
    }
}

function goToNextPage() {
    if ((currentPage + 1) * PAGE_SIZE < currentFiles.length) {
        currentPage++;
        displayCurrentPage();
    }
}

const previousButton = document.getElementById("previous-button");
previousButton.style.display = "none";
previousButton.onclick = goToPreviousPage;

const nextButton = document.getElementById("next-button");
nextButton.style.display = "none";
nextButton.onclick = goToNextPage;

let isLoading = false;

let calendarmainDiv = document.querySelectorAll('.calendar');

settings.onclick = () => {
    if (!isLoading) {
        isLoading = true;
        settings.classList.add("fa-spin");
        setTimeout(() => {
            settings.classList.remove("fa-spin");
            sideBarbox.forEach(toggle => toggle.classList.toggle('active'));
            calendarmainDiv.forEach(div => {
                div.classList.toggle('active');
                if (div.classList.contains("active")) {
                    fetchcalendar();
                    console.log('Fetch Calendar Events');
                }
            });
            isLoading = false;
        }, 500);
    }
};

// detect if the user is on an iOS device
var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var isWindows = navigator.userAgent.indexOf('Windows') > -1;
var isAndroid = /(android)/i.test(navigator.userAgent);

if (isAndroid) {
    sideBar.style.paddingBottom  = '10px';
}

// if (isIOS) {
//   // get a reference to the button element
//   var button = document.getElementById("check");
//   var DM = document.getElementById("DM");

//   // hide the button by setting the display property to "none"
//   DM.style.display = "none";
// }

var feedbackButton = document.getElementById("feedback-button");
var feedbackForm = document.getElementById("feedback-form");
var closeBtn = document.getElementById("close-btn");
var feedbackFormContent = document.getElementById("feedback-form-content");
var feedbackText = document.getElementById("feedback-text");
var feedbackname = document.getElementById("name-input");

feedbackButton.addEventListener("click", function() {
  feedbackForm.style.display = "block";
  document.getElementById("feedback-form").scrollIntoView({ behavior: 'smooth' });
  feedbackButton.style.display = "none";
});

closeBtn.addEventListener("click", function() {
    feedbackForm.style.display = "none";
    feedbackButton.style.display = "block";
});

feedbackFormContent.addEventListener("submit", function(event) {
    feedbackFormContent = DOMPurify.sanitize(feedbackFormContent);
    event.preventDefault();
    var feedback = feedbackText.value.trim();
    var feedbackn = feedbackname.value.trim();
    if (feedback !== "" && feedbackn !== "") { 
        var form = document.getElementById("feedback-form-content");
        fetch(form.action, {
            method: "POST",
            body: new FormData(document.getElementById("feedback-form-content"))
        }).then(response => response.json())          
        feedbackText.value = "";
        feedbackForm.style.display = "none";
        feedbackButton.style.display = "none";
        var feedbackform = document.querySelector("#feedback");
        feedbackform.innerHTML += `<div>Thanks for the feedback!</div>`
    }
});    

let categoryBtn = document.querySelectorAll('.category .btn');
let langBtn = document.querySelectorAll('.lang .btn');

var dataLang;
var dataCata;

langBtn.forEach(btn =>{
    btn.onclick = () => {
        langBtn.forEach(remove => remove.classList.remove('active'));
        clearList();
        dataLang = btn.getAttribute('data-lang');
        btn.classList.add('active');
        if(dataCata != null){
            scrollToArrow();
        }
    }
});

var t= new Date();
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.allorigins.win/raw?url=https://www.drikpanchang.com/dp-api/panchangam/dp-panchangam.php', true);
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 400) {
        var data = JSON.parse(xhr.response);
        mPanchangHeaderData = data.panchangam_header_data;
        if ((mPanchangHeaderData != null) && (mPanchangHeaderData != undefined)) {
            document.getElementById("month").innerHTML="Month: " + mPanchangHeaderData.regional_month;
        } else {
            document.getElementById("month").innerHTML="Month: Not Found";
        }
    } else {
        document.getElementById("month").innerHTML="Month: Not Found";
    }
};
xhr.send();
panchang.calculate(t, function() {
    function alltime() {
        document.getElementById("day").innerHTML="Today: " + panchang.Day.name;
        document.getElementById("tithi").innerHTML="Tithi: " + panchang.Tithi.name;
        document.getElementById("nakshtra").innerHTML="Nakshatra: " + panchang.Nakshatra.name;
        document.getElementById("karna").innerHTML="Karna: " + panchang.Karna.name;
        document.getElementById("yoga").innerHTML="Yoga: " + panchang.Yoga.name;
        document.getElementById("raasi").innerHTML="Raasi: " + panchang.Raasi.name;
        document.getElementById("ayanamsa").innerHTML="Ayanamsa: " + panchang.Ayanamsa.name;
    }


    // function updateTime(){
    //     var t = new Date();
    //     hours = t.getHours();
    //     minutes = t.getMinutes();
    //     if (hours == 12) {
    //         ampm = "PM";
    //     } else if (hours > 12) {
    //         hours = hours - 12;
    //         ampm = "PM";
    //     } else {
    //         ampm = "AM";
    //     }
    
    //     if (hours == 0) {
    //         hours = 12;
    //     }
    // }    

    // document.addEventListener("DOMContentLoaded", function() {
    //     setInterval(function(){
    //         updateTime();
    //     }, 1000);
    //     intervalId = setInterval(function(){
    //         document.getElementById("day").innerHTML = "Time is: " + hours + ":" + minutes + " " + ampm;
    //     }, 1000);
    //     clearInterval(intervalId);
    // });

    alltime()

    document.getElementById("tithi").addEventListener("click", function() {
        alltime()
        // clearInterval(intervalId);
        document.getElementById("tithi").innerHTML = "Tithi start: " + panchang.Tithi.start + "<br><br>Tithi end: " + panchang.Tithi.end;
    });
    document.getElementById("nakshtra").addEventListener("click", function() {
        alltime()
        // clearInterval(intervalId);
        document.getElementById("nakshtra").innerHTML = "Nakshtra start: " + panchang.Nakshatra.start + "<br><br>Nakshtra end: " + panchang.Nakshatra.end;
    });
    document.getElementById("karna").addEventListener("click", function() {
        alltime()
        // clearInterval(intervalId);
        document.getElementById("karna").innerHTML = "Karna start: " + panchang.Karna.start + "<br><br>Karna end: " + panchang.Karna.end;
    });
    document.getElementById("yoga").addEventListener("click", function() {
        alltime()
        // clearInterval(intervalId);
        document.getElementById("yoga").innerHTML = "Yoga start: " + panchang.Yoga.start + "<br><br>Yoga end: " + panchang.Yoga.end;
    });
    document.getElementById("day").addEventListener("click", function() {
        alltime()
        // intervalId = setInterval(function(){
        //     document.getElementById("day").innerHTML = "Time is: " + hours + ":" + minutes + " " + ampm;
        // }, 500);
    });
    document.getElementById("raasi").addEventListener("click", function() {
        alltime()
        // clearInterval(intervalId);
    });
    document.getElementById("ayanamsa").addEventListener("click", function() {
        alltime()
        // clearInterval(intervalId);
    });
    document.getElementById("month").addEventListener("click", function() {
        alltime()
        // clearInterval(intervalId);
    });
});

let reset = document.querySelector('.reset');

reset.onclick = () => {
    sideBar.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    langBtn.forEach(remove => remove.classList.remove('active'));
    categoryBtn2.forEach(remove => remove.classList.remove('active'));
    element.innerHTML = `Search Stotram: `;
    dataCata = null;
    previousButton.style.display = "none";
    nextButton.style.display = "none";
    dataLang = null;
    document.getElementById("search-box").value = "";
    document.getElementById("search-box").placeholder = "Search Stotram...";
    listContainer.innerHTML = '<div style="text-align: center;">No Files</div>'
}

document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
})

document.onkeydown = function (e) {
    if(event.keyCode == 123){
        return false;
    }

    if(e.ctrlKey && e.shiftKey && e.keyCode == "J".charCodeAt(0)){
        return false;
    }

    if(e.ctrlKey && e.keyCode == "U".charCodeAt(0)){
        return false;
    }
};

let darkMODEButton = document.querySelectorAll('.DARKMODE .btn');

let activeDMButton = localStorage.getItem('data-DM');
if (activeDMButton == null) {
  activeDMButton = "Light";
  localStorage.setItem('data-DM', activeDMButton);
}

// Set the active button and corresponding CSS file
darkMODEButton.forEach(btn => {
    if (btn.getAttribute('data-DM') == activeDMButton) {
      btn.classList.add("active");
      if (activeDMButton == "Dark") {
        root.style.setProperty('--primary-color', 'black');
        root.style.setProperty('--area-placeholder', 'white');
        root.style.setProperty('--secondary-color', 'white');
      } else {
        root.style.setProperty('--primary-color', 'white');
        root.style.setProperty('--area-placeholder', 'black');
        root.style.setProperty('--secondary-color', 'black');
      }
    } else {
      btn.classList.remove("active");
    }
});

// Add click handlers to the dark mode buttons
darkMODEButton.forEach(btn => {
  btn.onclick = () => {
    darkMODEButton.forEach(remove => remove.classList.remove('active'));
    btn.classList.add("active");
    dataDM = btn.getAttribute('data-DM');
    if (dataDM == "Dark") {
        root.style.setProperty('--primary-color', 'black');
        root.style.setProperty('--area-placeholder', 'white');
        root.style.setProperty('--secondary-color', 'white');
        localStorage.setItem("data-DM", "Dark");
    } else if (dataDM == "Light") {
        root.style.setProperty('--primary-color', 'white');
        root.style.setProperty('--area-placeholder', 'black');
        root.style.setProperty('--secondary-color', 'black');
        localStorage.setItem("data-DM", "Light");
    } else {
        root.style.setProperty('--primary-color', 'white');
        root.style.setProperty('--area-placeholder', 'black');
        root.style.setProperty('--secondary-color', 'black');
        localStorage.setItem("data-DM", "Light");
    }
  }
});

window.addEventListener("DOMContentLoaded", function(){
    document.getElementById('side-menu').style.display = "none";
    const gallery = document.getElementsByClassName('gallery');
    for (let i = 0; i < gallery.length; i++) {
        gallery[i].style.display = "none";
    }
});
