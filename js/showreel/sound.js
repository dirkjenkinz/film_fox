// Set active class for navigation
$(() => {
  $('#nav-sound').addClass('active');
});

// Event handler for merging sounds
$('.btn-merge').on('click', (e) => {
  const sceneNumber = e.target.value;
  const title = $('#filmTitle')[0].innerText;
  const elementNumber = $('#elementNumber')[0].innerText;
  window.location.href = `/concatenate-sound?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
});

// Event handler for playing a sound
$('.btn-play').on('click', (e) => {
  const title = $('#filmTitle')[0].innerText;
  const num = '000000' + e.target.value;
  const formattedNum = num.substring(num.length - 5);
  const element = `s${formattedNum}.mp3`;
  const soundPath = `../data/${title}/sound/scenes/${element}`;

  document.getElementById('master-play').setAttribute('src', soundPath);
  document.getElementById('master-play').play();
});

// Event handler for generating a single sound
$('.btn-compile').on('click', (e) => {
  const elements = e.target.value.split(',');
  const voice = elements[3];
  const character = elements[2];
  const sceneNumber = elements[0];
  const elementNumber = elements[1];
  const title = $('#filmTitle')[0].innerText;
  window.location.href = `/generate-single?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}&voice=${voice}&caller=sound&character=${character}`;
});

// Event handler for creating a master sound
$('#btn-master').on('click', () => {
  const title = $('#filmTitle')[0].innerText;
  const sceneNumber = $('#sceneNumber')[0].innerText;
  const elementNumber = $('#elementNumber')[0].innerText;
  const size = $('#size')[0].innerText;
  window.location.href = `/master?title=${title}&sceneNumber=${sceneNumber}&size=${size}&elementNumber=${elementNumber}`;
});

$('#btn-show-uncompiled').on('click', () => {
    $('#col-uncompiled').show();
    $('#col-incomplete').show();
    $('.sound-body').hide();
});

$('#btn-return').on('click', () => {
  $('#col-uncompiled').hide();
  $('#col-incomplete').hide();
  $('.sound-body').show();
});

// Event handler for playing the master sound
$('#btn-play-master').on('click', (e) => {
  const title = $('#filmTitle')[0].innerText;
  const soundPath = `../data/${title}/sound/scenes/master.mp3`;

  document.getElementById('master-play').setAttribute('src', soundPath);
  document.getElementById('master-play').play();
});
