//game of thrones
//const charList = document.getElementById('char-list');
const handleAppend = (name, alias, house, allegiances) => {
  let charName = name;
  let charAlias = alias;
  let charHouse = house;
  let charAllegiances = allegiances;

  if (charAlias.length !== 0) {
    charAlias = charAlias.join(', ');
  }

  handleShowHouseMembers(charHouse, charAllegiances);

  $('#tb-body').append(`
    <tr id="tb-row">
      <td>${charName || 'n/a'}</td>
      <td>${charAlias || 'n/a'}</td>
      <td id="house-item" data-bs-toggle="modal" data-bs-target="#house-modal">${
    charHouse || 'n/a'
  }</td>
    </tr>
  `);
};

const handleShowHouseMembers = (charHouse, charAllegiances) => {
  $.getJSON(charAllegiances).done((res) => {
    if (res.swornMembers.length !== 0) {
      for (let i = 0; i < res.swornMembers.length; i++) {
        $.getJSON(res.swornMembers[i]).done((member) => {
          if (charHouse === 'House Stark of Winterfell') {
            $('#house-list').append(`<li>${member.name}</li>`);
          }
        });
      }
    }
  });
};

const handleAjaxFetchChars = (pageNum) => {
  $.getJSON(
    `https://anapioficeandfire.com/api/characters?page=${pageNum}&pageSize=10`
  ).done((characterList) => {
    characterList.forEach(async (char) => {
      let charAlias = char.aliases;
      let charName = char.name;
      let charHouse;

      if (char.allegiances.length === 0) {
        $("#house-item").css('cursor', 'default');
        handleAppend(charName, charAlias);
      } else {
        $("#house-item").css('cursor', 'pointer');
        $.getJSON(char.allegiances)
        .done((res) => {
          charHouse = res.name;
          // console.log(res.swornMembers);
        })
        .then(() => {
          handleAppend(charName, charAlias, charHouse, char.allegiances);
        });
      }
    });
  });
};

const handleCheckPage = (pageNum) => {
  // console.log(pageNum);
  if (pageNum <= 1) {
    $('#prev-li').addClass('disabled');
  } else if (pageNum >= 215) {
    $('#next-li').addClass('disabled');
  } else {
    $('#prev-li').removeClass('disabled');
    $('#next-li').removeClass('disabled');
  }
};

// $('#house-modal').css('display', 'none');
$(() => {
  // $('#house-modal').modal('hide');


  let pageNum = 1;
  handleCheckPage(pageNum);
  handleAjaxFetchChars(pageNum);


  $('#current-page').append(pageNum);

  $('#next-page').click(() => {
    pageNum++;
    handleCheckPage(pageNum);
    $('#tb-body').empty();
    $('#current-page').empty();
    $('#current-page').append(pageNum);
    handleAjaxFetchChars(pageNum);
  });

  $('#prev-page').click(() => {
    pageNum--;
    handleCheckPage(pageNum);
    $('#tb-body').empty();
    $('#current-page').empty();
    $('#current-page').append(pageNum);
    handleAjaxFetchChars(pageNum);
  });
});
