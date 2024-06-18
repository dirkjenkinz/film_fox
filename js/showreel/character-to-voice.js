$(() => {
  var ctvScrollPos = localStorage.getItem('ctvScrollPosition');
    if (ctvScrollPos) {
      $(window).scrollTop(ctvScrollPos);
    }
  // Add 'active' class to the navigation item with id 'nav-ctv'
  $('#nav-ctv').addClass('active');

  // Save scroll position to localStorage when user is about to leave the page
  window.onbeforeunload = function () {
    localStorage.setItem('ctvScrollPosition', window.scrollY);
  };
});

// Event listener for change events on select elements
$('select').on('change', function (e) {
  // Extract character number from the name attribute of the select element
  const num = this.name.substring(7);

  // Get the id, character id, selected voice, and other relevant information
  const id = this.id;
  const cid = `char_${num}`;
  const voice = $(`#${id} option:selected`).text().trim();
  let character = $(`#${cid}`)[0].textContent;
  character = character.trim();
  const title = $('#filmTitle')[0].outerText;
  const sceneNumber = $('#sceneNumber')[0].innerText;
  const elementNumber = $('#elementNumber')[0].innerText;
  // Redirect to character-update page with the selected parameters
  window.location.href = `/character-update?title=${title}&character=${character}&voice=${voice}&elementNumber=${elementNumber}&sceneNumber=${sceneNumber}`;
});

// Event listener for click events on elements with class 'btn-play-sample'
$('.btn-play-sample').on('click', (e) => {
  // Get the value (id) of the clicked button
  const id = e.target.value;

  // Get the title and sample path
  const title = $('#filmTitle')[0].innerText;
  const s = `../data/samples/${id}.mp3`;

  // Set the 'src' attribute of the 'master-play' element and play it
  document.getElementById('master-play').setAttribute('src', s);
  document.getElementById('master-play').play();
});