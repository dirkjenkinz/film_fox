    // Function to build URL for various calls with optional scene and element numbers
  const buildShotListUrl = (call, sceneNumber, elementNumber) => {
    const title = $('#filmTitle')[0].innerText;
  
    // Set default scene and element numbers if not provided
    if (sceneNumber === '') {
      sceneNumber = $('#sceneNumber')[0].innerText;
    }
    if (elementNumber === '') {
      elementNumber = $('#elementNumber')[0].innerText;
    }
  
    return `/${call}?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
  };
  
  // Event listener for shot select change
  $('.shot-select').on('change', (e) => {
    const line = e.target.id;
    const val = e.target.value;
    let l1 = line.substring(5).split('_');
    const url = buildShotListUrl('update-shot-list', '', '');
    window.location.href = `${url}&val=${val}&item=${l1[0]}&line=${l1[1]}`;
  });
  
  // Event listener for shot subject focus out
  $('.shot-subject').on('focusout', (e) => {
    const line = e.target.id.substring(13);
    const val = e.target.value;
    const url = buildShotListUrl('update-shot-list', '', '');
    window.location.href = `${url}&val=${val}&item=subject&line=${line}`;
  });
  
  // Event listener for shot description change
  $('.shot-description').on('change', (e) => {
    const line = e.target.id.substring(17);
    const val = e.target.value;
    const url = buildShotListUrl('update-shot-list', '', '');
    window.location.href = `${url}&val=${val}&item=description&line=${line}`;
  });

  // Event listener for add shot button click
  $('.btn-add-shot').on('click', (e) => {
    const line = e.target.value;
    const title = $('#filmTitle')[0].outerText;
    const sceneNumber = $('#sceneNumber')[0].outerText;
    window.location.href = `/add-shot?title=${title}&sceneNumber=${sceneNumber}&elementNumber=0&line=${line}`;
  });
  
  // Event listener for delete shot button click
  $('.btn-delete-shot').on('click', (e) => {
    const line = e.target.value;
    const title = $('#filmTitle')[0].outerText;
    const sceneNumber = $('#sceneNumber')[0].outerText;
    window.location.href = `/delete-shot?title=${title}&sceneNumber=${sceneNumber}&elementNumber=0&line=${line}`;
  });
  
  // Event listener for input note focus out
  $('#input-note').on('focusout', (e) => {
    const val = e.target.value;
    const title = $('#filmTitle')[0].outerText;
    const sceneNumber = $('#sceneNumber')[0].outerText;
    window.location.href = `/update-note?title=${title}&sceneNumber=${sceneNumber}&elementNumber=0&val=${val}&caller=shot-list`;
  });
  