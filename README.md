# Bravo Programmable Remotes
This is a REST API that Crawls Bravo Remote Database from their PHP Server and gathering data via HTML Table Crawling

## Endpoints
- `[POST]` /search
```
{
    "model":"UE32"
}
```
Response:
```
{
"brand": "SAMSUNG",
"model": "UE32M5520",
"device": "TV",
"internal": "pr 6111",
"progr": "T1032",
"progr_url": "https://www.be-mind.it/europenet/prg_tlc.asp?tv=T1032",
"remote_img": "https://www.be-mind.it/europenet/Images/tlc/SAMSUNG%20BN5901268D.jpg",
"remote_schema": "https://www.be-mind.it/europenet/Images/map/T1032.JPG"
},
```

## TODO
- Device Type filter
- Device Brand filter