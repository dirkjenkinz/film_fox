// Function to build the parent URL based on the call, scene number, and element number
const buildParentUrl = (call, sceneNumber, elementNumber) => {
  const title = $('#filmTitle')[0].innerText;
  return `/${call}?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
};

// Event handler for the home navigation
$('#nav-front').on('click', () => {
  window.location.href = '/';
});

// Event handler for the scene arranger navigation
$('#nav-arranger').on('click', () => {
  const sceneNumber = $('#sceneNumber').text();
  const elementNumber = $('#elementNumber').text();
  const url = buildParentUrl('scene-arranger', sceneNumber, elementNumber);
  window.location.href = url;
});

// Event handler for the sheets navigation
$('#nav-sheets').on('click', () => {
  const url = buildParentUrl('sheets', 0, 0);
  window.location.href = `${url}&sheet=0`;
});

// Event handler for the showreel navigation
$('#nav-showreel').on('click', () => {
  const title = $('#filmTitle')[0].innerText;
  let sceneNumber = $('#sceneNumber').text();
  let elementNumber = $('#elementNumber').text();
  if (!sceneNumber) sceneNumber = 0;
  if (!elementNumber) elementNumber = 0;
  window.location.href = `/showreel?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
});

// Event handler for the breakdown navigation
$('#nav-breakdown').on('click', () => {
  const sceneNumber = $('#sceneNumber').text();
  const elementNumber = $('#elementNumber').text();
  const url = buildParentUrl('breakdown', sceneNumber, elementNumber);
  window.location.href = `${url}&action=display`;
});

// Event handler for the report navigation
$('#nav-report').on('click', () => {
  const sceneNumber = $('#sceneNumber').text();
  const elementNumber = $('#elementNumber').text();
  const url = buildParentUrl('breakdown-report', sceneNumber, elementNumber);
  window.location.href = url;
});

// Event handler for the credits navigation
$('#nav-credits').on('click', () => {
  const sceneNumber = $('#sceneNumber').text();
  const elementNumber = $('#elementNumber').text();
  const url = buildParentUrl('credits', sceneNumber, elementNumber);
  window.location.href = url;
});

// Event handler for the categories navigation
$('#nav-categories').on('click', () => {
  const sceneNumber = $('#sceneNumber').text();
  const elementNumber = $('#elementNumber').text();
  const url = buildParentUrl('categories', sceneNumber, elementNumber);
  window.location.href = url;
});

// Event handler for the generate paperwork navigation
$('#nav-generate-paperwork').on('click', () => {
  const sceneNumber = $('#sceneNumber').text();
  const elementNumber = $('#elementNumber').text();
  const url = buildParentUrl('generate-paperwork', sceneNumber, elementNumber);
  window.location.href = url;
});
