// Add 'active' class to the 'nav-breakdown' element when the window loads
$(window).on('load', function () {
  $('#nav-breakdown').addClass('active');

  // Retrieve and process hidden and categories values
  let hidden = $('#hidden')[0].innerText.split(',');
  let categories = $('#categories')[0].innerText.split(',');

  // Hide or show tables based on the hidden values
  categories.forEach((e, index) => {
    let table = `table-${e.replace(/ /gi, '-')}`;
    let control = `btn-control-${e.replace(/ /gi, '-')}`;
    
    if (hidden[0].charAt(index) === 'h') {
      $(`#${table}`).hide();
      $(`#${control}`).show();
    }
  });
});

// Function to build URLs with parameters
const buildUrl = (call, sceneNumber, elementNumber) => {
  // Retrieve title, sceneNumber, and elementNumber from the DOM
  const title = $('#filmTitle')[0].innerText;
  sceneNumber = sceneNumber === '' ? $('#sceneNumber')[0].innerText : sceneNumber;
  elementNumber = elementNumber === '' ? $('#elementNumber')[0].innerText : elementNumber;
  
  // Build and return the URL
  return `/${call}?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
};

// Function to retrieve the 'hidden' string based on current visibility
const listHidden = () => {
  let h = '';
  let categories = $('#categories')[0].innerText.split(',');

  // Check visibility for each category and update the 'hidden' string
  categories.forEach((e) => {
    let table = `table-${e.replace(/ /gi, '-')}`;
    if ($(`#${table}`).is(':hidden')) {
      h += 'h';
    } else {
      h += 'r';
    }
  });
  return h;
};

// Event handler for adding an entity
$('.btn-add-entity').on('click', (e) => {
  let eTargetValue = e.target.value.replace(/ /gi, '-');
  const element = $(`#btn-element-${eTargetValue}`)[0].innerText;
  const entity = $(`#input-entity-${eTargetValue}`)[0].value;
  const url = buildUrl('breakdown', '', '');
  window.location.href = `${url}&element=${element}&entity=${entity}&action=add&hidden=${listHidden()}`;
});

// Event handler for controlling visibility of a table
$('.btn-control').on('click', (e) => {
  let table = `table-${e.target.value.replace(/ /gi, '-')}`;
  let control = `btn-control-${e.target.value.replace(/ /gi, '-')}`;
  $(`#${table}`).show();
  $(`#${control}`).hide();
});

// Event handler for hiding a table
$('.btn-hide').on('click', (e) => {
  let table = `table-${e.target.value.replace(/ /gi, '-')}`;
  let control = `btn-control-${e.target.value.replace(/ /gi, '-')}`;
  $(`#${table}`).hide();
  $(`#${control}`).show();
});

// Event handler for hiding all tables
$('#btn-hide-all').on('click', () => {
  let categories = $('#categories')[0].innerText.split(',');
  categories.forEach((e) => {
    let table = `table-${e.replace(/ /gi, '-')}`;
    let control = `btn-control-${e.replace(/ /gi, '-')}`;
    $(`#${table}`).hide();
    $(`#${control}`).show();
  });
});

// Event handler for revealing all tables
$('#btn-reveal-all').on('click', () => {
  let categories = $('#categories')[0].innerText.split(',');
  categories.forEach((e) => {
    let table = `table-${e.replace(/ /gi, '-')}`;
    let control = `btn-control-${e.replace(/ /gi, '-')}`;
    $(`#${table}`).show();
    $(`#${control}`).hide();
  });
});

// Event handler for deleting an entity
$('.btn-del').on('click', (e) => {
  const hidden = listHidden();
  const element = e.target.id.substring(4);
  const entity = e.target.value;
  const url = buildUrl('breakdown', '', '');
  window.location.href = `${url}&element=${element}&entity=${entity}&action=del&hidden=${hidden}`;
});

// Event handler for clicking on an element button
$('.btn-element').on('click', (e) => {
  if (window.getSelection().anchorNode) {
    const element = e.target.value;
    const snippet = window.getSelection().anchorNode.data;
    let start = window.getSelection().anchorOffset;
    let finish = window.getSelection().focusOffset;
    if (start > finish) {
      const temp = start;
      start = finish;
      finish = temp;
    };
    const entity = snippet.substring(start, finish).trim().toUpperCase();
    const hidden = listHidden();
    let url = buildUrl('breakdown', '', '');
    url += `&element=${element}&entity=${entity}&action=add&hidden=${hidden}`;
    window.location.href = url;
  }
});

// Event handlers for navigating between scenes
$('#btn-previous-scene').on('click', () => {
  const sceneNumber = parseInt($('#sceneNumber')[0].innerText) - 1;
  const hidden = listHidden();
  const url = buildUrl('breakdown', sceneNumber, '');
  window.location.href = `${url}&hidden=${hidden}`;
});

$('#btn-next-scene').on('click', () => {
  const sceneNumber = parseInt($('#sceneNumber')[0].innerText) + 1;
  const hidden = listHidden();
  const url = buildUrl('breakdown', sceneNumber, '');
  window.location.href = `${url}&hidden=${hidden}`;
});

$('#btn-last-scene').on('click', () => {
  const sceneNumber = $('#highestScene')[0].innerText;
  const hidden = listHidden();
  const url = buildUrl('breakdown', sceneNumber, '');
  window.location.href = `${url}&hidden=${hidden}`;
});

$('#btn-first-scene').on('click', () => {
  const url = buildUrl('breakdown', 1, '');
  const hidden = listHidden();
  window.location.href = `${url}&hidden=${hidden}`;
});
