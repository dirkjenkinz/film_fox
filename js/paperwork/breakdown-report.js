$(document).ready(() => {
  // Add 'active' class to the 'nav-report' element
  $('#nav-report').addClass('active');
});

// Handle input event on the scene slider
$('#slider-scene').on('input', (e) => {
  // Update the output element with the current slider value
  $('#output')[0].innerText = e.target.value;
});

// Handle change event on the scene slider
$('#slider-scene').on('change', (e) => {
  // Retrieve relevant information from the DOM
  const sceneNumber = $('#output')[0].innerText;
  const title = $('#filmTitle')[0].innerText;
  const elementNumber = $('#elementNumber')[0].innerText;

  // Redirect to the breakdown-report page with the updated parameters
  window.location.href = `/breakdown-report?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
});

// Handle click event on the 'btn-previous' button
$('#btn-previous').on('click', (e) => {
  // Decrement the sceneNumber
  let sceneNumber = parseInt($('#sceneNumber')[0].innerText);
  sceneNumber--;

  // Retrieve relevant information from the DOM
  const title = $('#filmTitle')[0].innerText;
  const elementNumber = $('#elementNumber')[0].innerText;

  // Redirect to the breakdown-report page with the updated parameters
  window.location.href = `/breakdown-report?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
});

// Handle click event on the 'btn-next' button
$('#btn-next').on('click', (e) => {
  // Increment the sceneNumber
  let sceneNumber = parseInt($('#sceneNumber')[0].innerText);
  sceneNumber++;

  // Retrieve relevant information from the DOM
  const elementNumber = $('#elementNumber')[0].innerText;
  const title = $('#filmTitle')[0].innerText;

  // Redirect to the breakdown-report page with the updated parameters
  window.location.href = `/breakdown-report?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
});
