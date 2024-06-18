$(() => {
  // Add 'active' class to the navigation link for sheets
  $('#nav-sheets').addClass('active');
});

// Event listener for slider input change
$('#slider-scene').on('input', (e) => {
  // Update the displayed sheet number
  $('#output')[0].innerText = e.target.value;
});

// Event listener for slider change
$('#slider-scene').on('change', (e) => {
  const sheetNumber = e.target.value;
  const title = $('#filmTitle')[0].innerText;
  const sceneNumber = $('#sceneNumber')[0].innerText;
  const elementNumber = $('#elementNumber')[0].innerText;
  window.location.href = `/sheets?title=${title}&sheet=${sheetNumber}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
});

// Event listener for previous sheet button click
$('#btn-previous').on('click', (e) => {
  let sheet = parseInt($('#sheet')[0].innerText);
  sheet--;
  const title = $('#filmTitle')[0].innerText;
  const sceneNumber = $('#sceneNumber')[0].innerText;
  const elementNumber = $('#elementNumber')[0].innerText;
  window.location.href = `/sheets?title=${title}&sheet=${sheet}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
});

// Event listener for next sheet button click
$('#btn-next').on('click', (e) => {
  let sheet = parseInt($('#sheet')[0].innerText);
  sheet++;
  const title = $('#filmTitle')[0].innerText;
  const sceneNumber = $('#sceneNumber')[0].innerText;
  const elementNumber = $('#elementNumber')[0].innerText;
  window.location.href = `/sheets?title=${title}&sheet=${sheet}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
});
