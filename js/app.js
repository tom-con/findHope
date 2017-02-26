$().ready(() => {
  let searchTerms = [];
  let resultsArr = [];

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
    Materialize.toast(`${nameOfTerm} added to the search!`, 3000);
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
    let intro = $(`<div class="row"><div class="col s12 m12 center"><div class="card blue-grey darken-3"><div class="card-content white-text"><span class="card-title"><h2 class="thin welcome ">Welcome</h2></span><ul class="flow-text"><li><i class="material-icons medium">language</i></li><li class="thin text">Connect to active clinical trials across the U.S.</li><li> <i class="material-icons medium">search</i></li><li class="thin text">Search by geographic location and condition</li><li><i class="material-icons medium">list</i></li><li class="thin text">Get results in an easy to read format</li></ul></div><div class="card-action"><button id="welcome" class="btn">Continue</button></div></div></div></div>`);

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
      let condChip = $(`<div class="chip" data-id="${condition.term_key}">${condition.term}</div>`);
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
    $(event.target).text("Seach for more terms")
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
    console.log(retArray);
    return retArray;
  };

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  |                              |
  |        POPULATES RESULTS     |
  |        ON NEW PAGE           |
  |                              |
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  let populateResults = (arrayOfResults) => {
    console.log("in populateResults");
    console.log("results to populate with: ", arrayOfResults);
    let main = $('main');
    let description = $(`<div class="center row"><h5>${arrayOfResults.length} results have been found from your search parameters</h5></div>`);
    let newRow = '';
    main.children().remove();
    main.append(description);

    for (let i = 0; i < arrayOfResults.length; i++) {
      let curr = arrayOfResults[i];
      let trialCard = $(`<div class="card teal"><div class="card-content"><h5 class="thin white-text"> ${curr.contact.org_name} has an ongoing trial concerning these conditions: </h5><p class="white-text">${curr.diseaseArr}</p></div><div class="card-tabs"><ul class="tabs tabs-fixed-width"><li class="tab"><a class="purple-text text-darken-2" href="#${curr.nciID}contact">Contact</a></li><li class="tab"><a class="purple-text text-darken-2" href="#${curr.nciID}location">Location</a></li><li class="tab"><a class="active purple-text text-darken-2" href="#${curr.nciID}details">Details</a></li></ul></div><div class="card-content grey lighten-4"><div id="${curr.nciID}contact"><p class="row"><strong>Contact Name: </strong> ${curr.contact.org_name}</p><p class="row"><strong>Email: </strong> ${curr.contact.org_email}</p><p class="row"><strong>Phone: </strong> ${curr.contact.org_phone}</p></div>
      <div id="${curr.nciID}location"><p class="row">${curr.contact.org_name}</p><p class="row">${curr.contact.org_address_line_1}</p><p class="row">${curr.contact.org_city}, ${curr.contact.org_state_or_province}</p><p class="row">${curr.contact.org_postal_code}</p></div><div id="${curr.nciID}details">${curr.briefSummary}</div></div></div>`);
      newRow = $(`<div class="row"></div>`);
      main.append(newRow);
      newRow.append(trialCard);
    }
    $('ul.tabs').tabs();
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
    console.log("items added to array:", items);
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
        if (contObj[item] === null) {
          newObj[item] = "Information not available at this time";
        } else {
          newObj[item] = contObj[item];
        }
      }

      return newObj;
    };
    let getDiseases = (diseaseList) => {
      let newArr = [];
      for (let disease of diseaseList) {
        if (disease.inclusion_indicator === "TRIAL") {
          newArr.push(disease.preferred_name);
        }
      }
      newArr.splice(10, newArr.length - 10);
      let diseases = newArr.join(", ");

      return diseases;
    };
    for (let trial of items.trials) {
      let individualTrialInfo = {
        briefTitle: trial.brief_title,
        briefSummary: trial.brief_summary,
        title: trial.official_title,
        description: trial.detail_description,
        organization: trial.lead_org,
        nciID: trial.nci_id,
        nctID: trial.nct_id,
        diseaseArr: getDiseases(trial.diseases),
        contact: getContact(trial.sites[0]),
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
    console.log("Searchterms before search", searchTerms);
    var deferreds = [];
    $.each(searchTerms, (i) => {
      console.log(searchTerms[i]);
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
    console.log(deferreds);
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
