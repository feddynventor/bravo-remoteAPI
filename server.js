const express = require('express');
const HTMLParser = require('node-html-parser');
const html2json = require('html2json').html2json;
const HTTPclient = require('https')

// Constants
const PORT = 8090;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(express.json()); // built-in middleware for express

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/search', (req, res) => {

    // https://www.be-mind.it/europenet/ricok1.php?mc=0&md=ue32&tp=0&rictlc=&l=
    HTTPclient.get("https://www.be-mind.it/europenet/ricok1.php/?mc=0&md="+req.body.model+"&tp=0&rictlc=&l=", 
    function (query) {
        if (query.statusCode!=200){
            res.end()
            return
        }
        let page_body;
        let response_draft = [];
        query.on('data', function (chuck) {
            page_body+=chuck
        })
        query.on('end', function (){
            // const pageroot = HTMLParser.parse(page_body)
            // let test = pageroot.querySelectorAll(".table-int")[0].childNodes[1].childNodes[1]

            let rows = html2json(HTMLParser.parse(page_body).querySelectorAll(".table-int").toString()).child[0].child
            rows.forEach(tablerow => {
                if (tablerow.tag != 'tr')
                    return;

                let remote = []
                tablerow.child.forEach((cell, index) => {
                    if (cell.tag != 'td')
                        return;
                    if (!!cell.child[1] && cell.child[1].tag == 'img')
                        remote[index] = cell.child[1].attr.id
                    else
                        remote[index] = cell.child[0].text
                    // console.log(cell)
                })
                remote = remote.filter(function (e) {return e != null;})

                response_draft.push({
                    brand: remote[0],
                    model: remote[1],
                    device: remote[2],
                    internal: remote[3],
                    progr: remote[4],
                    progr_url: "https://www.be-mind.it/europenet/prg_tlc.asp?tv="+remote[4],
                    remote_img: (Array.isArray(remote[5]))?("https://www.be-mind.it/europenet/Images/tlc/"+remote[5].join('%20')):null,
                    remote_schema: "https://www.be-mind.it/europenet/Images/map/"+remote[6],
                })

            });
            // console.log( rows[1].attr.id, rows[1].child )
            
            res.status(200).send(response_draft)
        })
    }).on('error', function(e) {
        res.send(JSON.stringify({
            err: "Errore query",
            details: e
        }))
        res.end()
    })

})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);