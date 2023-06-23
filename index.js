// const http = require("http");
import express from "express";
import * as cheerio from "cheerio";
import fetch from "node-fetch";
// import request from "request-promise";
// var cors = require('cors');
import cors from 'cors';


// express class
var app = express();
// main url
const base_url = 'https://www1.myasiantv.cc/';
// app.use(express.json())

// header

app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});


// Home req get
app.get('/home',(req,res)=>{

    const data = async (base_url)=>{
        var datas = [];
        var slide_data = [];
        var recent_sub = {
            korean_sub : [],
            raw_epi : [],
            other_sub : [],
        }; 


        const response = await fetch(base_url).then((res)=>res.text()).then((text)=>{return text}).catch((err)=>{console.log(err)});
        const $ = cheerio.load(response);
        // console.log(response);

        let slide_img = $('ul[id="movie-random-list"] > li') // slide detail
        let korean_sub = $('div[class="loadep intro1"] > ul > li') // recent korean subbed
        let raw_epi = $('div[class="loadep intro2"] > ul > li') // recent RAW episode
        let other_sub = $('div[class="loadep intro3"] > ul > li') // recent other subbed

        // console.log(movies.length)

        // slide img
        slide_img.each((i,el)=>{
            let name = $(el).find('p').text().trim();
            let link = $(el).find('a').attr('href');
            let image = $(el).attr('style').split('url(')[1].split(')')[0];


            slide_data.push({
                name,link,image
            })
        });

        // korean sub
        korean_sub.each((i,el)=>{
            let name = $(el).find('a').text().trim();
            let link = $(el).find('a').attr('href');

            recent_sub.korean_sub.push({
                name,link
            })

        });

        // raw episode
        raw_epi.each((i,el)=>{
            let name = $(el).find('a').text().trim();
            let link = $(el).find('a').attr('href');

            recent_sub.raw_epi.push({
                name,link
            })

        });

        // other subbed
        other_sub.each((i,el)=>{
            let name = $(el).find('a').text().trim();
            let link = $(el).find('a').attr('href');

            recent_sub.other_sub.push({
                name,link
            })

        });
        

        // main push
        datas.push({
            slide_img:slide_data,recent_sub
        })

        res.send(datas)
    };
    data(base_url)
    
});

// top get 
app.get('/top/:day',(req,res)=>{

    const choice = req.params.day;

    const data = async (choice)=>{
        var datas = [];
        var top_data = [];

        var url = '';
        switch (choice) {
            case 'month':
                url = base_url+'anclytic.html?id=3';
                break;
            case 'week':
                url = base_url+'anclytic.html?id=2'
                break
            default:
                url = base_url+'anclytic.html?id=1'
                break;
        };

        const response = await fetch(url).then((res)=>res.text()).then((text)=>{return text}).catch((err)=>console.log(err));
        const $ = cheerio.load(response);

        let top = $('body > div')

        if (choice === 'day'){
            top = $('body > div') // top day
        };
        if (choice === 'week'){
            top = $('body > div') // top week
        };
        if (choice === 'month'){
            top = $('body > div') // top month
        };


        // top loop 
        top.each((i,el)=>{
            let name = $(el).find('h2').text().trim();
            let link = $(el).find('a').attr('href');
            let image = $(el).find('img').attr('src');

            top_data.push({
                name,image,link
            });
        });

        // main push
        datas.push({
            result:top_data,
        })


        res.send(datas)
    }; 
    data(choice)
});

// trnding
// app.get('/home/:q',(req,res)=>{
//     const querry = req.params.q;

//     const data = async (q)=>{
//         var datas = [];
//         var result = [];

//         var url = base_url+'ajax/drama_by_status/1.html?page=1';
//         switch (q) {
//             case 'air':
//                 url = base_url+'ajax/drama_by_status/2.html?page=1';
//                 break;
            
//             case 'completed':
//                 url = base_url+'ajax/drama_by_status/3.html?page=1';
//                 break;
        
//             default:
//                 url = base_url+'ajax/drama_by_status/2.html?page=1';
//                 break;
//         };
//         console.log(q,url)

//         const response = await fetch(url).then((res)=>res.text()).then((text)=>{return text}).catch((err)=>console.log(err));
//         const $ = cheerio.load(response);

//         let trending_data = $('div[id="list-1"] > div > ul > li') // movies 
//         if (q === 'movie'){
//             trending_data = $('div[id="list-1"] > div > ul > li') // movies 
//         };
//         if (q === 'air'){
//             trending_data = $('div[id="list-2"] > div > ul > li') // on the air
//         };
//         if (q === 'completed'){
//             trending_data = $('div[id="list-3"] > div > ul > li') // completed
//         };

//         trending_data.each((i,el)=>{
//             let name = $(el).find('h2 > a').text().trim();
//             let link = $(el).find('a').attr('href');
//             let image = $(el).find('img').attr('src');

//             result.push({
//                 name,link,image
//             });
//         });


//         // main push
//         datas.push({
//             result
//         })

//         res.send(datas)
//     };
//     data(querry)
// });

// get req for search
app.get('/search',(req,res)=>{
    // console.log(req.query);
    var q = req.query.q;
    var page = req.query.page || null;
    // console.log(page)
    
    

    const data = async (q,page,base_url)=>{
        var datas = [];

        // if (page === null){
        //     const url = `https://www1.myasiantv.cc/search.html?key=${q}`;
        // }else{
        //     const url = `https://www1.myasiantv.cc/search.html?key=${q}&page=${page}`;
        // };

        // const url = url;

        switch (page) {
            case null:
                var url = base_url+`search.html?key=${q}`;
                break;
        
            default:
                var url = base_url+`search.html?key=${q}&page=${page}`;
                break;
        };

        // console.log(url)

        const response = await fetch(url).then((res)=>res.text()).then((text)=>{return text})

        const $ = cheerio.load(response);

        let list = $('div[class="list"] > div > ul > li') 

        // let image = $('div[id="list-1"] > div > ul > li >') 

        // let title = $('div[id="list-1"] > div > ul > li') 

        list.each((index,element)=>{

            // console.log(index,element)
            datas.push({
                name : $(element).find("h2 > a").text().trim(),
                link : $(element).find("h2 > a").attr('href'),
                image : $(element).find('img').attr('src'),
            });
        });

        switch (datas) {
            case []:
                res.send({message:"No Data Found !!!"})
                break;
        
            default:
                res.send(datas);
                break;
        }
        // console.log(typeof datas)
    };
    data(q,page,base_url)
});

// get req for detail view
app.get('/:drama/:slug',(req,res)=>{

    // console.log(req.params)

    const q = req.params.slug;
    const drama = req.params.drama;

   const data = async (q,drama,base_url)=>{
    
        var datas = []
        var details_data = {
            // name:'',
            Original_name:'',
            Release_year:'',
            Status:'',
            Country:'',
            Genre:[],
        };
        var episodes = [];
        var similar = [];

        var url = base_url+`${drama}/${q}`;
        // console.log(url)
        // const response = await request({
        //     uri:url,
        //     headers:{
        //         'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        //         'accept-encoding': 'gzip, deflate, br',
        //         'accept-language': 'en-US;q=0.7'
        //     },
        //     gzip:true,
        // });

        var response = await fetch(url).then((res)=>res.text()).then((text)=>{return text});

        const $ = cheerio.load(response);

        let name = $('div[class="movie"] > a > h1').text().trim();
        let Image = $('div[class="left"] > img').attr("src");              // [0].attributes[1].value
        let summery = $('div[class="info"]').text().trim();
        let details = $('div[class="left"] > p') // name,orignal name, country, year, genre, status
        let Episodes = $('ul[class="list-episode"] > li') // according to episode
        let Similar = $('div[id="sidebarlist-1"] > div').slice(0,10) // 11 data

        // details arry

        details.each((index,element)=>{
            
            let key = $(element).find('strong').text().trim();
            let value = $(element).find('span').text().trim();

            //    if (key === "Name:"){
            //     var name = value;
            //     details_data.name = name; 
            //    };
           if (key === "Original name:"){
            details_data.Original_name = value.split('\n').join(',').split(' ').join('');
           }
           else if (key === "Release year:"){
            details_data.Release_year = value;
           }
           else if (key === "Country:"){
            details_data.Country = value;
           }
           else if (key === "Status:"){
            details_data.Status = value;
           }
           else if (key === "Genre:"){
            var Genre = value.split(',');
            details_data.Genre = Genre
           };

        });

        // Episodes $ Date

        Episodes.each((index,element)=>{
            let name = $(element).find('a').text().trim();
            let link = $(element).find('a').attr('href');
            let created = $(element).find('span').text().trim().split(' ')[0];
            // console.log(name,link,created)

            episodes.push({
                ep_name:name,link:link,created
            });

        });

        // similar

        Similar.each((index,element)=>{

            let name = $(element).find("h2 > a").text().trim();
            let image = $(element).find("img").attr('src');
            let link = $(element).find('a').attr('href');
            let ep = $(element).find('p').text().split(':')[1].split("R")[0].trim();
            let year = $(element).find('p').text().split('year:')[1];
            // console.log(name,image,link,ep,year)

            similar.push({
                name,image,link,ep,year
            });
        });

        // main list 
        datas.push({
            name,type:drama,image:Image,detail:details_data,summery,episodes,similar
        });

        res.send(datas);

   };

   data(q,drama,base_url);

});

// Eipsodes get /episodes-num
app.get('/:drama/:slug/:episode',(req,res)=>{
    
    const drama = req.params.drama;
    const slug = req.params.slug;
    const episode = req.params.episode;

    const data = async (d,s,e,base_url)=>{
        var datas = [];
        var server_list = [];
        var episodes = [];
        var k_slug = [];
        var other_slug = [];

        const url = base_url+`${d}/${s}/${e}`;
        const response = await fetch(url).then((res)=>res.text()).then((text)=>{return text});

        const $ = cheerio.load(response);

        let name = $('div[class="play"] > h1').text().trim().split(' Eng')[0]; // Name
        let download = 'https:'+$('a[class="download"]').attr('href'); // download btn link
        let main_server = 'https:'+$('div[class="play-video"] > iframe').attr('src'); // main server
        let servers = $('div[class="CapiTnv nav nav-pills anime_muti_link"] > div'); // servers
        let Episodes = $('ul[class="list-episode"] > li'); // according to episode
        let next_ep = $('div[class="play"] > ul > li > a[class="m3"]').attr('href'); // next episode
        let prev_ep = $('div[class="play"] > ul > li > a[class="m1"]').attr('href'); // previous episode
        let korean_sug = $('div[id="sidebarlist-1"] > div').slice(0,16) // korean dramas suggesion 11
        let other_sug = $('div[id="sidebarlist-2"] > div').slice(0,16) // other dramas suggesion


        // servers loop

        servers.each((index,element)=>{
            let server_name = $(element).attr('title').trim();
            let server = $(element).attr('data-video');
            if (server_name === 'Our Server'){
                server = "https:"+server
            };
            server_list.push({
                server_name,server
            });
        });

        // Episodes $ Date

        Episodes.each((index,element)=>{
            let name = $(element).find('a').text().trim();
            let link = $(element).find('a').attr('href');
            let created = $(element).find('span').text().trim().split(' ')[0];
            // console.log(name,link,created)

            episodes.push({
                ep_name:name,link:link,created
            });

        });

        // korean suggession

        korean_sug.each((index,element)=>{
            let name = $(element).text().trim(); // episode name
            let link = $(element).find("a").attr('href'); // ep link

            k_slug.push({
                name,link
            });
        });

        // other suggession

        other_sug.each((index,element)=>{
            let name = $(element).text().trim(); // episode name
            let link = $(element).find("a").attr('href'); // ep link

            other_slug.push({
                name,link
            });
        });


        // main data
        datas.push({
            name,type:d,download,main_server,servers:server_list,episodes,next_ep:next_ep||null,prev_ep:prev_ep||null,k_slug,other_slug
        });

        res.send(datas);
    };

    data(drama,slug,episode,base_url);
});

// port
app.listen(5000,()=>{
    console.log("Your Server Running in port %d",5000)
});