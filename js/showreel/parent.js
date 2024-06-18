const buildParentUrl = (call, sceneNumber, elementNumber) => {
  const title = encodeURIComponent($('#filmTitle')[0].innerText);
  return `/${call}?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
};

const navigate = (call) => {
  const sceneNumber = $('#sceneNumber')[0].innerText;
  const elementNumber = $('#elementNumber')[0].innerText;
  const url = buildParentUrl(call, sceneNumber, elementNumber);
  window.location.href = url;
};

$('#nav-front').on('click', () => {
  window.location.href = '/';
});

$('#nav-ctv').on('click', () => navigate('ctv'));

$('#nav-characters').on('click', () => navigate('characters'));

$('#nav-sound').on('click', () => navigate('sound'));

$('#nav-video').on('click', () => navigate('video'));

$('#nav-paperwork').on('click', () => navigate('scene-arranger'));

$('#nav-showreel').on('click', () => {
  const title = encodeURIComponent($('#filmTitle')[0].innerText);
  const sceneNumber = $('#sceneNumber')[0].innerText || 0;
  const elementNumber = $('#elementNumber')[0].innerText || 0;
  window.location.href = `/showreel?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
});

// Start slideshow for the current scene and element
$('#nav-slideshow').on('click', () => {
  const title = encodeURIComponent($('#filmTitle')[0].innerText);
  const sceneNumber = $('#sceneNumber')[0].innerText;
  const elementNumber = $('#elementNumber')[0].innerText;
  window.location.href = `/slideshow?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
});

$('#nav-show-gallery').on('click', () => navigate('show-gallery'));

$('#nav-voices').on('click', () => navigate('voices'));

