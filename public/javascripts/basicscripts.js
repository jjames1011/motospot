function hideshow() {
  console.log('fired');
  var x = document.getElementById('hideshow');
  if(x.style.display === 'none') {
    x.style.display = 'block';
  } else {
    x.style.display = 'none';
  }

}
