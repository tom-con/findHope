$().ready(() => {
  var itemIDArr = [];
  var populateList = (items) => {
    console.log(items);
    if(items.Ack === "Failure"){
      Materialize.toast('Search did not match any resuts-- very sorry!', 4000)
      return null;
    }
    // console.log(items);
    let container = $('#results');
    container.children().remove();
    itemIDArr.length = 0;
    let itemArr = items.ItemArray.Item;
    for (let i = 0; i < itemArr.length; i++) {
      let currItem = itemArr[i];
      var newRow;
      if (!(i % 3)) {
        newRow = $("<div class='row'></div>");
        container.append(newRow)
      }

      newRow.append(`<div class="col s12 m4"><div class="card"><div class="card-image" data-id="${currItem.ItemID}"><img src="${currItem.GalleryURL}" height="200px"><span class=" card-title purple darken-2 white-text price">$ ${currItem.ConvertedCurrentPrice.Value}</span></div><div class="card-content"><p>${currItem.Title.substring(0, 50)}...</p></div><div class="card-action"><a class="teal-text" href="${currItem.ViewItemURLForNaturalSearch}">On Ebay!</a></div></div></div>`);
      itemIDArr.push(currItem.ItemID);
    }
    return items;
  };
  var changePicture = (itemData, itemID) => {
    console.log(itemData);
    let currentItem = $(`div[data-id="${itemID}"] img`);
    currentItem.attr("src", itemData.Item.PictureURL[0]);
  }

  $('#button').click((event) => {
    let search = $('#search').val();
    $.ajax({
      method: "GET",
      url: `http://open.api.ebay.com/shopping?callname=FindPopularItems&responseencoding=JSON&appid=ThomasCo-JustPric-PRD-22466ad44-3702e34e&siteid=0&QueryKeywords=${search}&version=713`,
      dataType: "JSON",
      success: (data) => populateList(data),
      error: () => console.log("error")
    }).then((data) => {
      for (var i = 0; i < itemIDArr.length; i++) {
        let thisItemID = itemIDArr[i];
        $.ajax({
          method: "GET",
          url: `http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=ThomasCo-JustPric-PRD-22466ad44-3702e34e&siteid=0&ItemID=${itemIDArr[i]}&version=713`,
          dataType: "JSON",
          success: (data) => changePicture(data, thisItemID),
          error: () => console.log("error")
        })
      }
    })
  });
});
