const fs = require("fs")

const getMedia = async function (pathTo) {
  let videos = []
  const dirs = await fs.promises.opendir(pathTo)

  for await (const dir of dirs) {
    videos.push({ name: dir.name })
  }
  return videos
}

const Init = async (app, target)=> {
  var videos = await getMedia(target)
  console.log('check for update')
  console.log(videos)
  app.get('/update', (req, res) => {
    res.status(200).json({
    res: videos,
  })
 })
}

module.exports = { getMedia, Init }
