function hideshow() {
  console.log('fired');
  var x = document.getElementById('hideshow');
  if(x.style.display == 'block') {
    x.style.display = 'none';
  } else {
    x.style.display = 'block';
  }
}
