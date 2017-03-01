$().ready(() => {
  let searchTerms = [];
  let resultsArr = [];

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  |                              |
  |        MAKES MAP FOR         |
  |        CURRENT TRIAL IN      |
  |        THE POPULATE AREA     |
  |                              |
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  let makeMap = (nciID, coordArray, contact) => {
    let mapOptions = {
      zoom: 3,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: new google.maps.LatLng(39.8282, -98.5795),
      panControl: false,
      panControlOptions: {
        position: google.maps.ControlPosition.BOTTOM_LEFT
      },
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.LARGE,
        position: google.maps.ControlPosition.RIGHT_CENTER
      },
      scaleControl: false
    };

    let map = new google.maps.Map(document.getElementById(`${nciID}loc`), mapOptions);

    for (var i = 0; i < coordArray.length; i++) {
      let contentString = `<p class="row purple-text"><strong>${contact[i].org_name}</strong></p><p class="row">${contact[i].org_phone}</p><p class="row">${contact[i].org_address_line_1}</p><p class="row">${contact[i].org_city}, ${contact[i].org_state_or_province}</p><p class="row">${contact[i].org_postal_code}</p>`
      let infowindow = new google.maps.InfoWindow({
        content: contentString
      });
      let marker = new google.maps.Marker({
        position: {
          lat: parseFloat(coordArray[i].lat),
          lng: parseFloat(coordArray[i].lon)
        },
        map: map
      });
      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
    }
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  |                              |
  |        ADD SELECTED TERMS    |
  |        TO SEARCH/CHIP ROW    |
  |        AND SEARCH ARRAY      |
  |                              |
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  let addToSearch = (termToSearch, nameOfTerm) => {
    let searchTermRow = $('#searchTermRow');
    searchTermRow.append(`<div id="${termToSearch}"class="chip purple-text">${nameOfTerm}<i class="close material-icons">close</i></div>`);
    Materialize.toast(`${nameOfTerm} added to the search!`, 2000);
    searchTerms.push(nameOfTerm);
    let chip = $(`#${termToSearch}`);
    let condBoxChip = $('#condBox').children(`.purple-text[data-id="${termToSearch}"]`);

    chip.click((event) => {
      let cut = searchTerms.indexOf(nameOfTerm);
      searchTerms.splice(cut, 1);
      condBoxChip.toggleClass('purple-text');
    });
  };

  let removeFromSearch = (termToRemove) => {
    $(`#${termToRemove}`).remove();
  };

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  |                              |
  |        CREATE HOME PAGE      |
  |                              |
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  let createWelcomePage = () => {
    let body = $('body');
    let main = $('main');
    main.children().remove();
    let intro = $(`<div class="row"><div class="col s12 m12 center"><div class="card blue-grey darken-3"><div class="card-content white-text"><span class="card-title"><h2 class="thin welcome">Welcome</h2></span><ul class="flow-text"><li><i class="material-icons medium">language</i></li><li class="thin text">Connect to active clinical trials across the U.S.</li><li> <i class="material-icons medium">search</i></li><li class="thin text">Search by geographic location and condition</li><li><i class="material-icons medium">list</i></li><li class="thin text">Get results in an easy to read format</li></ul></div><div class="card-action"><button id="welcome" class="btn flow-text">Continue</button></div></div></div></div>`);

    main.append(intro);
    $('#welcome').click((event) => createSearchPage());
  };

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  |                              |
  |        CREATE PAGE TO        |
  |        SEARCH FOR TERMS      |
  |                              |
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  let createSearchPage = () => {
    searchTerms = [];
    resultsArr = [];
    let body = $('body');
    let main = $('main');
    let description = $(`<div class="row"><p class="center col s12 m12 flow-text">Please enter a condition to search for.</p></div>`);
    let form = $(`<form id="inputForm" class="row"></form>`);
    let condition = $(`<input id="mainSearch" class="col s12 m10 offset-m1 flow-text" type="text" placeholder="Ex. Pancreatic Carcinoma, Lung, Lymphoma">`);
    let searchButton = $(`<button id="termSearch" class="btn col s8 offset-s2 m6 offset-m3 flow-text">Search for Terms</button>`);
    let condBox = $(`<div id="condBox" class="center col s12 m12 condBox tooltipped" data-position="right" data-delay="50" data-tooltip="Click on terms to add them to your search!"><p>Add to Search</p></div>`);

    body.css("background-image", "url('./img/gplaypattern.png')");
    main.css("background-color", "rgba(255, 255, 255, 0.6)");
    main.children().remove();
    form.append(condition);
    form.append(searchButton);
    main.append(description);
    main.append(form);
    main.append(condBox);
    searchButton.click(ajaxTerms);
    $('.tooltipped').tooltip({delay: 50});
  };

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  |                              |
  |        AFTER TERM SEARCH,    |
  |        POPULATES TERM        |
  |        LIST, AND             |
  |        ALLOWS USER TO        |
  |        CHOOSE VALUES         |
  |        TO ADD TO             |
  |        MAIN SEARCH           |
  |                              |
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  let giveOptions = (items) => {
    let main = $('main');
    let termArray = items.terms;
    if (termArray.length === 0) {
      Materialize.toast('Please try a different term to search', 4000);

      return null;
    }
    let condBox = $('#condBox');
    let searchTermRow = $('<div id="searchTermRow" class="center row flow-text"></div>');
    condBox.children().remove();
    for (let condition of termArray) {
      if(condition.term.toLowerCase().includes("center") || condition.term.toLowerCase().includes("institute") || condition.term.toLowerCase().includes("consortium") || condition.term.toLowerCase().includes("cancercare") || condition.term.toLowerCase().includes("united states")){ }
      else if (condBox.children().length < 20) {
        let condChip = $(`<div class="chip flow-text" data-id="${condition.term_key}">${condition.term}</div>`);
        condBox.append(condChip);
        condChip.click((event) => {
          if (!($(event.target).hasClass('purple-text'))) {
            $(event.target).toggleClass("purple-text");
            addToSearch(condition.term_key, condition.term);
          } else {
            $(event.target).toggleClass('purple-text');
            removeFromSearch(condition.term_key, condition.term);
          }
        });
      }

    }

    if (!(main.children().last()[0] === $('#continueRow')[0])) {
      let continueRow = $('<div id="continueRow" class="row"></div>');
      let continueButton = $(`<button id="continueToFilter" class="btn tooltipped col s8 offset-s2 m6 offset-m3 flow-text" data-position="right" data-delay="50" data-tooltip="You can search for more terms above"> Finished Adding Terms</button>`);

      continueRow.append(continueButton);
      main.append('<br>');
      main.append(searchTermRow);
      main.append('<br>');
      main.append(continueRow);
      continueButton.click((event) => {
        createForm();
      });
    }
  };

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  |                              |
  |        CONDUCTS THE TERM     |
  |        SEARCH AND MAKES      |
  |        SURE THERE IS A       |
  |        VALID QUERY           |
  |                              |
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  let ajaxTerms = (event) => {
    event.preventDefault();
    $(event.target).text("Seach for more terms");
    let search = $('#mainSearch').val();
    if (search.length === 0) {
      Materialize.toast('Please enter a term to search', 4000);

      return null;
    }
    $.ajax({
      method: "GET",
      url: `https://clinicaltrialsapi.cancer.gov/v1/terms?size=100&term=${search}`,
      dataType: "JSON",
      success: (data) => giveOptions(data),
      error: () => console.log("Search term error")
    });
  };

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  |                              |
  |        CREATES MAIN          |
  |        FILTER PAGE WHERE     |
  |        USER CAN INPUT        |
  |        OPTIONS TO NARROW     |
  |        THE MAIN SEARCH       |
  |                              |
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  let createForm = () => {
    let main = $('main');
    let description = $('<div class="row center flow-text"><h5>Please filter your search with the following options:</h5></div><div class="row center flow-text"><h6>(You can leave fields blank to increase search results)</h6></div>');
    main.children().remove();
    let form = $(`<form id="inputForm"></form>`);
    let row1 = $(`<div class="row"></div>`);
    let row2 = $(`<div class="row"></div>`);
    let stateArr = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "GU", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MH", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "PR", "PW", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VI", "VT", "WA", "WI", "WV", "WY"];
    let stateListDiv = $(`<div class="input-field col s6 m2 offset-m2"></div>`);
    let stateList = $('<select id="state"></select>');
    let accepting = $('<p class="col s4 m4 offset-m2"><input id="accepting" type="checkbox" ><label for="accepting">Currently Accepting Volunteers</label></p>');
    let sex = $('<div class="col s6 m4 offset-m2"><p><input class="with-gap" name="sex" value="female" type="radio" id="female"><label for="female">Female</label></p><p><input class="with-gap" name="sex" value="male" type="radio" id="male"><label for="male">Male</label></p></div>');
    let age = $('<div class="col s6 m2 offset-m2"><input id="age" type="text"><label>Age</label></div>');
    let buttonRow = $('<div class="row"></div>');
    let button = $(`<button id="find" class="btn col s12 m4 offset-m4">Find</button>`);

    stateList.append(`<option value="" disabled selected>State</option>`);
    for (let state of stateArr) {
      stateList.append(`<option value="${state}">${state}</option>`);
    }
    stateList.append('<label>State</label>');
    stateListDiv.append(stateList);
    buttonRow.append(button);
    row1.append(accepting, stateListDiv);
    row2.append(sex, age);
    form.append(row1, row2, buttonRow);
    main.append(description, form);
    stateList.material_select();
    button.click((event) => getData());
  };

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  |                              |
  |        REMOVES DUPLICATES    |
  |        FROM RESULT ARRAY     |
  |                              |
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  let removeDuplicates = (arrayOfResults) => {
    let summArr = [];
    let retArray = [];
    for (let i = arrayOfResults.length - 1; i >= 0; i--) {
      if (!(summArr.includes(arrayOfResults[i].briefSummary))) {
        summArr.push(arrayOfResults[i].briefSummary);
        retArray.push(arrayOfResults[i]);
      }
    }
    // console.log(retArray);
    return retArray;
  };

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  |                              |
  |        POPULATES RESULTS     |
  |        ON NEW PAGE           |
  |                              |
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  let populateResults = (arrayOfResults) => {
    let main = $('main');
    main.children().remove();

    let bestMatch = $('<div class="row center"><h5>Top 3 trials matching your search:</h5></div>')
    let quickHitCont = $('<div></div>')
    let quickHitRow = $(`<div class="collection" id="#quickHitRow"></div>`).appendTo(quickHitCont);
    let buttonRow = $(`<div class="row"><div id="searchAgain" class="col s12 m6 offset-m3 btn white purple-text">Start Another Search</div></div>`)
    let organizeRow = $(`<div class="center row flow-text"><h5>All ${arrayOfResults.length} trials that match your search:</h5></div>`);
    let newRow = '';
    main.append(bestMatch, quickHitCont, buttonRow, organizeRow);
    $('#filtration').material_select();
    $(buttonRow).click(createSearchPage);


    let makeResults = (resultsArrToMake) => {
      for (let i = 0; i < resultsArrToMake.length; i++) {
        let curr = resultsArrToMake[i];
        let stars = "";
        for (let i = 0; i < curr.diseaseElement[1]; i++) {
          stars += '<i class="small material-icons purple-text left">stars</i>';
        }
        let quickHit = $(`<a href="#${curr.nciID}" class="col s12 m12 collection-item">${stars}${curr.contact[0].org_name} in ${curr.contact[0].org_city}, ${curr.contact[0].org_state_or_province}</a>`)
        let trialCard = $(`<div class="card teal" id="${curr.nciID}"><div class="card-content"><h5 class="thin white-text"> ${curr.contact[0].org_name} has an ongoing trial concerning these conditions: </h5><div id="${curr.nciID}diseaseArea"></div></div><div class="card-tabs"><ul class="tabs tabs-fixed-width"><li class="tab"><a class="purple-text text-darken-2" href="#${curr.nciID}contact">Contact</a></li><li class="tab"><a class="active purple-text text-darken-2" href="#${curr.nciID}location">Location</a></li><li class="tab"><a class="purple-text text-darken-2" href="#${curr.nciID}details">Details</a></li></ul></div><div class="card-content grey lighten-4"><div id="${curr.nciID}contact"><p class="row"><strong>Contact Name: </strong> ${curr.contact[0].org_name}</p><p class="row"><strong>Email: </strong> ${curr.contact[0].org_email}</p><p class="row"><strong>Phone: </strong> ${curr.contact[0].org_phone}</p></div>
        <div id="${curr.nciID}location"><div id="${curr.nciID}loc" class="map"></div></div><div id="${curr.nciID}details">  <ul class="collapsible" data-collapsible="accordion"><li><div class="collapsible-header"><i class="material-icons">subject</i>Summary</div><div class="collapsible-body"><span>${curr.briefSummary}</span></div></li><li><div class="collapsible-header"><i class="material-icons">perm_identity</i>Principal Investigator</div><div class="collapsible-body"><span>${curr.principalInvestigator}</span></div></li><li><div class="collapsible-header"><i class="material-icons">call_merge</i>Collaborators</div><div class="collapsible-body"><span>${curr.collaborators}</span></div></li></ul></div></div></div>`);
        newRow = $(`<div class="row trial"></div>`);
        main.append(newRow);
        newRow.append(trialCard);
        if (quickHitRow.children().length < 3) {
          quickHitRow.append(quickHit);
        }
        $(`#${curr.nciID}diseaseArea`).append(curr.diseaseElement[0]);
        makeMap(curr.nciID, curr.coordinates, curr.contact);
        //
      }
      $('ul.tabs').tabs();
      $('.collapsible').collapsible();
    }

    let organizeList = (trialArr) => {
      // console.log(trialArr);
      $('.trial').remove();

      let finalArr = [];


      finalArr = trialArr.sort((a, b) => {
        return a.diseaseElement[1] - b.diseaseElement[1];
      }).reverse();

      makeResults(finalArr);
    };


    organizeList(arrayOfResults);
    $('#goSearch').click(() => {
      console.log("clicked");
      organizeList(arrayOfResults);
    });
  };

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  |                              |
  |        CREATES RESULTS       |
  |        Array WHERE USER      |
  |        CAN SEE CLINICAL      |
  |        TRIALS NEAR THEM      |
  |                              |
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  let addToTrialArray = (items) => {
    console.log("searchresults", items);
    let parseUnstructured = (unstrucList) => {
      let arr = [];
      for (let obj of unstrucList) {
        arr.push(obj.description);
      }
      return arr;
    };
    let getContact = (contArr) => {
      let newArr = [];
      for (let i = 0; i < contArr.length; i++) {
        let newObj = {};
        for (let item in contArr[i]) {
          if (contArr[i][item] === null) {
            newObj[item] = "Information not available at this time";
          } else {
            newObj[item] = contArr[i][item];
          }
        }
        newArr.push(newObj);
      }
      return newArr;
    };

    let getLocation = (locationArr) => {
      let sitesArr = [];
      let locArr = getContact(locationArr);
      for (let i = 0; i < locationArr.length; i++) {
        let locObj = locArr[i];
        if (locObj.hasOwnProperty('org_coordinates')) {
          let orgLat = locObj.org_coordinates.lat;
          let orgLon = locObj.org_coordinates.lon;
          sitesArr.push({
            lat: orgLat,
            lon: orgLon
          });
        }
      }
      return sitesArr;
    };

    let getDiseases = (diseaseList) => {
      let diseaseListElement = $('<div class="row"></div>');
      let left = $('<div class="col s12 m6"></div>').appendTo(diseaseListElement);
      let leftUl = $('<ul class="collection"></ul>').appendTo(left);
      let right = $('<div class="col s12 m6"></div>').appendTo(diseaseListElement);
      let rightUl = $('<ul class="collapsible" data-collapsible="accordion"></ul>').appendTo(right);
      let otherDiseases = $('<li></li>').appendTo(rightUl);
      let otherDiseaseHead = $('<div class="collapsible-header">Other conditions</div>').appendTo(otherDiseases);
      let otherDiseaseBody = $('<div class="collapsible-body"></div>').appendTo(otherDiseases);
      let otherDiseaseBodyUl = $('<ul></ul>').appendTo(otherDiseaseBody);
      let starCount = 0;
      let otherCount = 0;
      for (let i = 0; i < diseaseList.length; i++) {
        let newDisease = "";
        let hiddenDisease = "";
        if (diseaseList[i].inclusion_indicator === "TRIAL") {
          if (searchTerms.includes(diseaseList[i].preferred_name)) {
            leftUl.append($(`<li class="collection-item"><i class="small material-icons left purple-text">stars</i>${diseaseList[i].preferred_name}</li>`));
            starCount++;
          } else {
            otherDiseaseBodyUl.append($(`<li class="collection-item">${diseaseList[i].preferred_name}</li>`));
            otherCount++;
          }
        }
      }
      otherDiseaseBody.css("background-color", "#FFF")
      otherDiseaseHead.prepend($(`<span class="badge">${otherCount}</span>`))
      return [diseaseListElement[0], starCount];
    };

    for (let trial of items.trials) {
      let individualTrialInfo = {
        briefTitle: trial.brief_title,
        briefSummary: trial.brief_summary,
        principalInvestigator: trial.principal_investigator,
        title: trial.official_title,
        description: trial.detail_description,
        organization: trial.lead_org,
        contact: getContact(trial.sites),
        collaborators: trial.collaborators[0].name,
        coordinates: getLocation(trial.sites),
        nciID: trial.nci_id,
        nctID: trial.nct_id,
        diseaseElement: getDiseases(trial.diseases),
        primaryPurpose: trial.primary_purpose.primary_purpose_code,
        eligibility: {
          maxAge: trial.eligibility.structured.max_age,
          minAge: trial.eligibility.structured.min_age,
          gender: trial.eligibility.structured.gender,
          other: parseUnstructured(trial.eligibility.unstructured)
        }
      };
      resultsArr.push(individualTrialInfo);
    }
  };

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  |                              |
  |        CONDUCTS THE MAIN     |
  |        SEARCH AND MAKES      |
  |        SURE THERE IS A       |
  |        VALID QUERY           |
  |                              |
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  let getData = () => {
    event.preventDefault();

    let state = $('#state').val() === null ? "" : `&sites.org_state_or_province=${$('#state').val()}`;
    let accepting = `&accepts_healthy_volunteers_indicator=${$('#accepting').is(':checked') ? "YES" : "NO"}`;
    let sex = $('input[name="sex"]:checked').val() === null ? "both" : `&eligibility.structured.gender=both&eligibility.structured.gender=${$('input[name="sex"]:checked').val()}`;
    // console.log("Searchterms before search", searchTerms);

    let deferreds = [];
    $.each(searchTerms, (i) => {
      let disease = `&diseases.display_name=${searchTerms[i]}`;
      deferreds.push(
        $.ajax({
          method: "GET",
          url: `https://clinicaltrialsapi.cancer.gov/v1/clinical-trials?size=50${state}${accepting}${sex}${disease}`,
          dataType: "JSON",
          success: (data) => addToTrialArray(data),
          error: () => console.log("error")
        })
      );
    });
    $.when.apply($, deferreds).then(() => {
      populateResults(removeDuplicates(resultsArr));
    }).fail(() => console.log("error"));
  };

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  |                              |
  |        CALLS HOME PAGE       |
  |        CREATION AND SETS     |
  |        UP EVENT CYCLE        |
  |                              |
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  createWelcomePage();
});
