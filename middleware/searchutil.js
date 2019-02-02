const sanitizer = require('sanitize')();
//Format search filters along with grab zip codes/ surrounding cities to help aid in search
function formatSearchFilters(cityInput, zipOrPostalInput) {
  let dbSearchFilters = {}
  let city, zipOrPostal;

  if(cityInput && zipOrPostalInput){
    city = sanitizer.value(cityInput, 'str');
    zipOrPostal = sanitizer.value(zipOrPostalInput, 'int');
    dbSearchFilters = {
      '$and': [
      {'$or': [{ 'title': {'$regex': `${city}`, '$options': 'i'}}, {'city': city.toLowerCase()}]},
      {'$or': [{ 'title': {'$regex': `${zipOrPostal}`, '$options': 'i'}}, {'zipOrPostal': zipOrPostal}]}
    ]
    }
  } else if(cityInput){
    city = sanitizer.value(cityInput, 'str');

    dbSearchFilters = {
     '$or': [{ 'title': {'$regex': `${city}`, '$options': 'i'}}, {'city': city.toLowerCase()}]
    }
  } else if(zipOrPostalInput) {
    zipOrPostal = sanitizer.value(zipOrPostalInput, 'int');
    dbSearchFilters = {
     '$or': [{ 'title': {'$regex': `${zipOrPostal}`, '$options': 'i'}}, {'zipOrPostal': zipOrPostal}]
    }
  }
  return dbSearchFilters;
}

module.exports.formatSearchFilters = formatSearchFilters;

// Posts.find({$or: [{city: 'glendale'}, { title: {$regex: 'phoenix', $options: 'i'}}]})
