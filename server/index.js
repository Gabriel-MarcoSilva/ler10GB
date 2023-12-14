import { createServer } from 'node:http'

import { createReadStream } from 'node:fs'
import { Readable, Transform } from 'node:stream'
import { WritableStream, TransformStream } from 'node:stream/web'

import csvtojson from 'csvtojson'

const PORT = 3000

//curl -N localhost:3000
//curl -i -X OPTIONS -N localhost:3000

createServer(async (req, res) => {

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
    }

    if (req.method === "OPTIONS") {
        res.writeHead(204, headers)
        res.end()
        return
    }

    let items = 0

    Readable.toWeb(createReadStream('./anime/animeflv.csv')) //toWeb faz com q seja utilizado na web
        .pipeThrough(Transform.toWeb(csvtojson()))
        .pipeTo(new WritableStream({ //é sempre a ultima etapa
            write(chunk) {
                items++
                res.write(chunk)
            },
            close() {
                res.end()
            }
        }))

    res.writeHead(200, headers)
    // res.end('ok')
})
    .listen(PORT)
    .on('listening', _ => console.log('server ir running at ' + PORT))