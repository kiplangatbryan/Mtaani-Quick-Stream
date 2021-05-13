const express = require("express")
const path = require("path")
const fs = require("fs")
const cors = require('cors')
const patches = require('./bin/util')
const maindrive = require('./bin/player')

const app = express()
const PORT = 4000 | process.env.PORT

// settings
app.set("view engine", "ejs")
app.set("views", "pages")

app.use(express.static("public"))
app.use(cors())
// important directories
// const movies_dir = path.join("C:", "Users", "bryan", "Videos", "Movies")
// const music_dir = path.join("C:", "Users", "bryan", "Music", "Music")

const movies_dir = "/home/bryan/Movies/Haikyuu"
const music_dir = "/home/bryan/VD"
const RootFolder = "/home/bryan/Music/Mine"

app.get("/", async (req, res) => {

  const shows = await patches.getMedia(RootFolder)


  res.render("index", {
    pageTitle: "Home | Locale",
    shows: shows
  })
})

app.get('/tvshow/:show',async (req, res) => {
  const show = req.params.show


  fs.readdir(path.join(RootFolder, show),(err, files) => {
    if (err) {
       return res.redirect('/player/'+ show+'/?show=\./')
    }
})

  let pathTo = path.join(RootFolder, show) 
   

  let episodes = await patches.getMedia(pathTo)
  let  episodesArray = []
  episodes.forEach((item, i) => {
      episodesArray.push(item.name)
  });
  episodes = episodesArray.sort()

  res.render('main', {
    pageTitle: show + ' | Locale',
    episodes: episodes,
    label: show
  })

})


app.get("/search", async (req, res) => {
  const query = req.query
  var content = []

  if (query.path == "/") {
    // run  a loop
    movies = await require("./bin/util").getMedia(movies_dir)

    movies.forEach(function ({ name }) {
      name = name.toLocaleLowerCase()
      search = query.search.toLocaleLowerCase()
      if (name.indexOf(search) != -1) {
        content.push(name)
      }
    })
  } else if (query.path == "/music") {
    music = await require("./bin/util").getMedia(music_dir)

    music.forEach(function ({ name }) {
      name = name.toLocaleLowerCase()
      search = query.search.toLocaleLowerCase()
      if (name.indexOf(search) != -1) {
        content.push(name)
      }
    })
  }

  res.status(200).json({
    res: content,
  })
})


app.use(maindrive)

app.listen(PORT, () => {
  console.log("[1] -- service is running")
})
