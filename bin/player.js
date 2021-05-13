const fs = require("fs")
const path = require("path")
const router = require('express').Router()
const Fetcher = require('../bin/util')

const RootDir = "/home/bryan/Music/Mine"


  router.get("/player/:id",async (req, res) => {
    const fileName = req.params.id
    const show = req.query.show

    let pathTo = path.join(RootDir, show)

    let episodes = await Fetcher.getMedia(pathTo)

    res.render("player", {
      pageTitle: `Load | ${fileName}`,
      title: fileName,
      episodes: episodes,
      label: show
    })
  })

  router.get("/service-stream/:id", (req, res) => {
    const video = req.params.id
    const show = req.query.show

    let temp = video.split(".")
    var ext = temp[temp.length - 1]

    const mediaFile = path.join(RootDir, show,video)
    fs.stat(mediaFile, (err, stat) => {
      if (err) {
        console.log(err)
      }
      const range = req.headers.range
      const fileSize = stat.size
      //  set the default size
      const defaultChunk = 1024 * 100000

      if (range) {
        console.log("Requesting Range ... ")
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0])
        const end = parts[1] ? parseInt(parts[1]) : fileSize - 1
        console.log(start, end)
        const chunkSize = start - end + 1

        const head = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Range": "bytes",
          "Content-Length": chunkSize,
          "Content-Type": `video/${ext}`,
        }
        res.writeHead(206, head)
        return fs.createReadStream(mediaFile, { start, end }).pipe(res)
      }
      const head = {
        "Content-Length": fileSize,
        "Content-Type": `video/${ext}`,
      }

      res.writeHead(200, head)
      fs.createReadStream(mediaFile).pipe(res)
    })
  })


module.exports = router
