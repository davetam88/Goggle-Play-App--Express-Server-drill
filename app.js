const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
// show log 
app.use(morgan('common'));
const DATABASE = require('./playstore.js');
app.use(cors());
`
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

app.get('/apps', (req, res) => {
  const { genres = "", sort = "" } = req.query;
  let results = DATABASE;

  // return all if no sort key or generes key
  if (!sort && !genres)
  {
    res.json(results);
    return
  }

  if (sort)
  {
    let sortType = sort.toLowerCase();
    // looking for sort=app or rating only. 
    if (!['rating', 'app'].includes(sortType))
    {
      return res.status(400)
        .send('Sort must be one of Rating or App');
    }
  }

  // sort by app or rating, note hat the key are in capital letters.
  if (sort)
  {
    const sortKey = capitalizeFirstLetter(sort);
    // the data base is in all capital letter.
    results.sort((a, b) => {
      return a[sortKey] > b[sortKey] ? 1 : a[sortKey] < b[sortKey] ? -1 : 0;
    });
  }


  const genresInCap = capitalizeFirstLetter(genres);

  // make sure the sort key is comverted to Caps as the DB is 
  if (genres)
  {
    if (!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genresInCap))
    {
      return res.status(400)
        .send('Genres value must be Action, Puzzle, Strategy, Casual, Arcade, Card');
    }
  }

  if (genres)
  {
    const newDBList = results.map(objectDB => {
      if (objectDB.Genres.split(";").includes(genresInCap))
      {
        return (objectDB);
      }
    })
    const filteredDB = newDBList.filter((tmp) => (tmp !== undefined));
    results = filteredDB;
  }

  res.json(results);

});

app.listen(8000, () => {
  console.log('Server started on PORT 8000');
});


/*
http://localhost:8000/apps
http://localhost:8000/apps?sort=app
http://localhost:8000/apps?sort=rating
http://localhost:8000/apps?genres=Action
http://localhost:8000/apps?genres=Adventure
http://localhost:8000/apps?genres=Arcade
http://localhost:8000/apps?genres=Card
http://localhost:8000/apps?genres=Casual
http://localhost:8000/apps?genres=Puzzle
http://localhost:8000/apps?genres=Strategy
*/

