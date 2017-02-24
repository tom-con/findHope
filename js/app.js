$().ready(() => {
  let searchTerms = [];

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  |                              |
  |        ADD SELECTED TERMS    |
  |        TO SEARCH/CHIP ROW    |
  |        AND SEARCH ARRAY      |
  |                              |
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  let addToSearch = (termToSearch, nameOfTerm) => {
    let searchTermRow = $('#searchTermRow');
    searchTermRow.append(`<div id="${termToSearch}"class="chip">${nameOfTerm}<i class="close material-icons">close</i></div>`);
    searchTerms.push(nameOfTerm);
    console.log(searchTerms);
  };

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  |                              |
  |        CREATE HOME PAGE      |
  |                              |
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  let createWelcomePage = () => {
    let body = $('body');
    let main = $('main');
    let intro = $(`<div class="row"><div class="center col s12 m10 offset-m1"><div class="card blue-grey darken-3"><div class="card-content white-text"><span class="card-title"><h2 class="thin welcome">Welcome</h2></span><p>Let <span class="companyCall">findHope&#8482;</span> help you and your loved ones connect to cancer patient clinical trials across the United States through an easy to use web application. Search through the National Cancer Institute's entire database of available trials in minutes. Narrow your search by condition, location, age, and more.</p></div><div class="card-action"><button id="welcome" class="btn">Continue</button></div></div></div></div>`);

    main.append(intro);
  };

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  |                              |
  |        CREATE PAGE TO        |
  |        SEARCH FOR TERMS      |
  |                              |
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  let createSearchPage = () => {
    let body = $('body');
    let main = $('main');
    let description = $(`<div class="row"><p class="center col s12 m12">Please enter a condition to search for.</p></div>`);
    let form = $(`<form id="inputForm" class="row"></form>`);
    let condition = $(`<input id="mainSearch" class="col s12 m10 offset-m1" type="text" placeholder="Ex. Pancreatic Carcinoma, Lung, Lymphoma">`);
    let searchButton = $(`<button id="termSearch" class="btn col s8 offset-s2 m6 offset-m3">Search for Terms</button>`);
    let condBox = $(`<div id="condBox" class="center col s12 m12 condBox"><p>Add to Search</p></div>`);

    body.css("background-color", "rgb(255, 255, 255)");
    main.children().remove();
    form.append(condition);
    form.append(searchButton);
    main.append(description);
    main.append(form);
    main.append(condBox);
    searchButton.click(ajaxTerms);
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
    let searchTermRow = $('<div id="searchTermRow" class="center row"></div>');

    condBox.children().remove();
    for (let condition of termArray) {
      let condChip = $(`<div class="chip">${condition.term}</div>`)
      condBox.append(condChip);
      condChip.click(() => addToSearch(condition.term_key, condition.term));
    }

    if (!(main.children().last()[0] === $('#continueRow')[0])) {
      let continueRow = $('<div id="continueRow" class="row"></div>');
      let continueButton = $(`<button id="continueToFilter" class="btn col s8 offset-s2 m6 offset-m3"> Finished Adding Terms</button>`);

      continueRow.append(continueButton);
      main.append('<br>');
      main.append(searchTermRow);
      main.append('<br>');
      main.append(continueRow);
      continueButton.click((event) => {
        createForm();
      })
    }

  }

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
    let search = $('#mainSearch').val();
    if (search.length === 0) {
      Materialize.toast('Please enter a term to search', 4000);
      return null;
    }
    $.ajax({
      method: "GET",
      url: `https://clinicaltrialsapi.cancer.gov/v1/terms?size=20&term=${search}`,
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
    let description = $('<div class="row center"><h5>Please filter your search with the following options:</h5></div><div class="row center"><h6>(You can leave fields blank to increase search results)</h6></div>');
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
  |        POPULATES RESULTS     |
  |        ON NEW PAGE           |
  |                              |
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  let populateResults = (arrayOfResults) => {
    console.log(arrayOfResults);
    let main = $('main');
    let newRow = '';
    main.children().remove();

    for (var i = 0; i < arrayOfResults.length; i++) {
      let curr = arrayOfResults[i];
      let trialCard = $(`<div class="card">
        <div class="card-content"><h6></h6>
      </div>
      <div class="card-tabs">
        <ul class="tabs tabs-fixed-width">
          <li class="tab"><a href="#${curr.nciID}contact">Contact</a></li>
          <li class="tab"><a href="#${curr.nciID}location">Location</a></li>
          <li class="tab"><a class="active" href="#${curr.nciID}details">Details</a></li>
        </ul>
      </div>
      <div class="card-content grey lighten-4">
        <div id="${curr.nciID}contact"><div class="row"><strong>Contact Name:</strong> ${curr.contact.contact_name}</div><div class="row"><strong>Contact Email:</strong> ${curr.contact.contact_email}</div></div>
        <div id="${curr.nciID}location">Text here2</div>
        <div id="${curr.nciID}details">${curr.briefSummary}</div>
      </div>
    </div>`)
      newRow = $(`<div class="row"></div>`);
      main.append(newRow);
      newRow.append(trialCard);
      $('ul.tabs').tabs();
    }


  };

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  |                              |
  |        CREATES RESULTS       |
  |        Array WHERE USER      |
  |        CAN SEE CLINICAL      |
  |        TRIALS NEAR THEM      |
  |                              |
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  let createTrialArray = (items) => {
    console.log(items);
    let parseUnstructured = (unstrucList) => {
      let arr = [];
      for (let obj of unstrucList) {
        arr.push(obj.description);
      }
      return arr;
    };
    let getContact = (contObj) => {
      let newObj = {};
      for (let item in contObj) {
        newObj[item] = contObj[item];
      }
      return newObj;
    }
    let trialArr = [];
    console.log("entire result!", items);
    for (let trial of items.trials) {
      // console.log("this trial", trial);
      let individualTrialInfo = {
        briefTitle: trial.brief_title,
        briefSummary: trial.brief_summary,
        title: trial.official_title,
        description: trial.detail_description,
        organization: trial.lead_org,
        nciID: trial.nci_id,
        nctID: trial.nct_id,
        contact: getContact(trial.sites[0]),
        eligibility: {
          maxAge: trial.eligibility.structured.max_age,
          minAge: trial.eligibility.structured.min_age,
          gender: trial.eligibility.structured.gender,
          other: parseUnstructured(trial.eligibility.unstructured)
        }
      };
      trialArr.push(individualTrialInfo);
    }
    populateResults(trialArr);
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
    let state = `&sites.org_state_or_province=${$('#state').val()}`;
    let accepting = `&accepts_healthy_volunteers_indicator=${$('#accepting').is(':checked') ? "YES" : "NO"}`;
    let sex = `&eligibility.structured.gender=both&eligibility.structured.gender=${$('input[name="sex"]:checked').val()}`;
    $.ajax({
      method: "GET",
      url: `https://clinicaltrialsapi.cancer.gov/v1/clinical-trials?size=50${state}${accepting}${sex}`,
      dataType: "JSON",
      success: (data) => createTrialArray(data),
      error: () => console.log("error")
    });
  };

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  |                              |
  |        CALLS HOME PAGE       |
  |        CREATION AND SETS     |
  |        UP EVENT CYCLE        |
  |                              |
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  createWelcomePage();

  $('#welcome').click((event) => {
    createSearchPage();
  });
});
