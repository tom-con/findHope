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

    main.append(intro)

  }
  let createSearchPage = () => {
    let body = $('body');
    let main = $('main');
    let description = $(`<div class="row"><p class="center col s12 m12">Please enter a condition to search for.</p></div>`)
    let form = $(`<form id="inputForm" class="row"></form>`);
    let condition = $(`<input id="mainSearch" class="col s12 m10 offset-m1" type="text" placeholder="Ex. Pancreatic Carcinoma, Lung, Lymphoma">`);
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
    if(termArray.length === 0){
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

  let ajaxTerms = (event) => {
    event.preventDefault();
    let search = $('#mainSearch').val();
    if (search.length === 0) {
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
    let stateArr = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "GU", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MH", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "PR", "PW", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VI", "VT", "WA", "WI", "WV", "WY"];
    let listDiv = $(`<div class="input-field col s4 m2"></div>`);
    let list = $('<select id="state"></select>');
    let accepting = $('<p class="col s6 m3 offset-m1"><input id="accepting" type="checkbox" checked="checked"><label for="accepting">Currently Accepting Volunteers</label></p>');
    let button = $(`<button id="find" class="btn col s6 m2 offset-m1">Find</button>`);

    list.append(`<option value="" disabled selected>State</option>`)
    for (let state of stateArr) {
      list.append(`<option value="${state}">${state}</option>`);
    }
    list.append('<label>State</label>');
    listDiv.append(list);
    list.material_select();
    form.append(accepting);
    form.append(listDiv);
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
