const sanitizer = require('sanitize')();
//Format search filters along with grab zip codes/ surrounding cities to help aid in search
function formatSearchFilters(cityInput, zipOrPostalInput) {
  let dbSearchFilters = {}
  let city, zipOrPostal;

  if(cityInput && zipOrPostalInput){
    city = sanitizer.value(cityInput, 'str');
    zipOrPostal = sanitizer.value(zipOrPostalInput, 'int');
    dbSearchFilters = {
      city: city.toLowerCase(),
      zipOrPostal: zipOrPostal
    }
  } else if(cityInput){
    city = sanitizer.value(cityInput, 'str');
    dbSearchFilters = {
      city: city.toLowerCase()
    }
  } else if(zipOrPostalInput) {
    zipOrPostal = sanitizer.value(zipOrPostalInput, 'int');
    dbSearchFilters = {
      zipOrPostal: zipOrPostal
    }
  }
  return dbSearchFilters;
}

module.exports.formatSearchFilters = formatSearchFilters;
