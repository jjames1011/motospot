function hideshow(ev) {
  var x = ev.target.nextSibling;
  if(x.style.display == 'block') {
    x.style.display = 'none';
  } else {
    x.style.display = 'block';
  }
}
