$().ready(() => {
  let searchTerms = [];
  let addToSearch = (termToSearch, nameOfTerm) => {
    let searchTermRow = $('#searchTermRow');
    searchTermRow.append(`<div id="${termToSearch}"class="chip">${nameOfTerm}<i class="close material-icons">close</i></div>`);
    console.log(searchTerms);
  };

  let createWelcomePage = () => {
    let body = $('body');
    let main = $('main');
    let intro = $(`<div class="row"><div class="center col s12 m10 offset-m1"><div class="card blue-grey darken-3"><div class="card-content white-text"><span class="card-title"><h2 class="thin welcome">Welcome</h2></span><p>Let <span class="companyCall">findHope&#8482;</span> help you and your loved ones connect to cancer patient clinical trials across the United States through an easy to use web application. Search through the National Cancer Institute's entire database of available trials in minutes. Narrow your search by condition, location, age, and more.</p></div><div class="card-action"><button id="welcome" class="btn">Continue</button></div></div></div></div>`);

    body.css("background-color", "rgb(33, 33, 33)")
    main.append(intro)

  }
  let createSearchPage = () => {
    let body = $('body');
    let main = $('main');
    let description = $(`<div class="row"><p class="center col s12 m12">Please enter a condition to search for.</p></div>`)
    let form = $(`<form id="inputForm" class="row"></form>`);
    let condition = $(`<input id="mainSearch" class="col s12 m10 offset-m1" type="text" placeholder="Ex. Pancreatic">`);
    let searchButton = $(`<button id="termSearch" class="btn col s8 offset-s2 m6 offset-m3">Search for Terms</button>`);
    let condBox = $(`<div id="condBox" class="center col s12 m12 condBox"><p>Add to Search</p></div>`)


    body.css("background-color", "rgb(255, 255, 255)")
    main.children().remove();
    form.append(condition);
    form.append(searchButton)
    main.append(description);
    main.append(form);
    main.append(condBox);
    searchButton.click(ajaxTerms);
  }

  let giveOptions = (items) => {
    let main = $('main');
    let termArray = items.terms;
    let condBox = $('#condBox');
    let searchTermRow = $('<div id="searchTermRow" class="row"></div>');
    let continueRow = $('<div id="continueRow" class="row"></div>');
    let continueButton = $(`<button id="continueToFilter" class="btn col s8 offset-s2 m6 offset-m3"> Finished Adding Terms</button>`);

    for (let condition of termArray) {
      console.log(condition);
      let condChip = $(`<div class="chip">${condition.term}</div>`)
      condBox.append(condChip);
      condChip.click(() => addToSearch(condition.term_key, condition.term));
    }
    continueRow.append(continueButton);
    main.append('<br>');
    main.append(searchTermRow);
    main.append('<br>');
    main.append(continueRow);
  }

  let ajaxTerms = (event) => {
    event.preventDefault();
    let search = $('#mainSearch').val();
    if(search.length === 0){
      Materialize.toast('Please enter a term to search', 4000);
      return null;
    }
    $.ajax({
      method: "GET",
      url: `https://clinicaltrialsapi.cancer.gov/v1/terms?term=${search}`,
      dataType: "JSON",
      success: (data) => giveOptions(data),
      error: () => console.log("Search term error")
    });
  };



  let createForm = () => {
    let main = $('main');
    main.children().remove();
    let form = $(`<form id="inputForm" class="row"></form>`);
    let spacing = $(`<div class="col s1 m1"></div>`)
    let stateArr = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "GU", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MH", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "PR", "PW", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VI", "VT", "WA", "WI", "WV", "WY"];
    let listDiv = $(`<div class="input-field col s4 m1"></div>`);
    let list = $('<select id="state"></select>');
    let button = $(`<button id="find" class="btn col s6 m2">Find</button>`);

    form.append(spacing);
    list.append(`<option value="" disabled selected>State</option>`)
    for (let state of stateArr) {
      list.append(`<option value="${state}">${state}</option>`);
    }
    list.append('<label>State</label>');
    listDiv.append(list);
    form.append(listDiv);
    form.append(spacing);
    list.material_select();

    form.append(button);
    main.append(form);
  }

  let populateList = (items) => {
    console.log(items);
  };

  createWelcomePage();

  $('#welcome').click((event) => {
    createSearchPage();
  });

  $('#find').click((event) => {
    event.preventDefault();
    let state = $('#state').val();
    console.log(state);
    $.ajax({
      method: "GET",
      url: `https://clinicaltrialsapi.cancer.gov/v1/clinical-trials?sites.org_state_or_province=${state}`,
      dataType: "JSON",
      success: (data) => populateList(data),
      error: () => console.log("error")
    });
  });
});
