#!/usr/bin/env node
import fs from 'fs';
import { S3 } from "@aws-sdk/client-s3";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';
import crypto from 'crypto';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const s3Client = new S3({
    forcePathStyle: false, 
    endpoint: process.env.DO_SPACE_ENDPOINT,
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.DO_SPACE_KEY,
      secretAccessKey: process.env.DO_SPACE_SECRET
    }
});

if (process.argv.length != 3) {
    console.log ('usage: binder <source dir>') 
    process.exit()
}

// get the project folder from the command line
let sourceDir = process.argv[2]

// parse the test file 
let app = fs.readFileSync(__dirname + '/' + sourceDir +  '/binder.json')
let parsedApp = JSON.parse(app)
let outputApp = { } 
let buildCacheFile = { } 

// copy over name, author and version
outputApp.name = { }
outputApp.name.bundle = parsedApp.name.bundle
outputApp.name.display = parsedApp.name.display
outputApp.author = parsedApp.author
outputApp.version = parsedApp.version

// generate output to 'out'
if (!fs.existsSync(__dirname + '/out')){
    fs.mkdirSync(__dirname + '/out');
} else {
    fs.rmSync(__dirname + '/out', { recursive: true})
    fs.mkdirSync(__dirname + '/out');
}

// create a bucket for this class
import { CreateBucketCommand } from "@aws-sdk/client-s3";
const bucketParams = { Bucket: parsedApp.name.bundle };

const run = async () => {
    try {
      const data = await s3Client.send(new CreateBucketCommand(bucketParams));
      // console.log("Success", data.Location);
      return data;
    } catch (err) {
      // console.log("Error", err);
    }
  };
  
let data = run().then(function (d){ 
    // console.log(d)
})


// check if an app manifest already exists and parse it
let existingURL = process.env.DO_SPACE_ENDPOINT + '/' + parsedApp.name.bundle + '/binder.json'

import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

let existingCache = { };

try { 

    // get a cache file if it exists so we don't upload stuff that is already there 
    const getObjectResult = await s3Client.send(new GetObjectCommand({
        Bucket: parsedApp.name.bundle,
        Key: '.build/cache.json'
    }));
    
    // env-specific stream with added mixin methods.
    const bodyStream = getObjectResult.Body;

    // one-time transform.
    const bodyAsString = await bodyStream.transformToString();
    existingCache = JSON.parse(bodyAsString)  

} catch (e) { 


}

await (async () => { 

    // iterate over the keys of contents
    outputApp.modules = [ ]
    buildCacheFile = { }
    let modules = Object.keys(parsedApp.modules)

    for (let i = 0; i < modules.length; i++) { 
        
        let moduleName = modules[i]
        let videos = Object.keys(parsedApp.modules[moduleName])

        let theModule = [ ]
        for (let j = 0; j < videos.length; j++) { 

            let videoName = videos[j];

            let type = parsedApp.modules[moduleName][videoName].type
            let source = parsedApp.modules[moduleName][videoName].path

            console.log(source)
    
            // get raw video data 
            const input = fs.readFileSync(__dirname + '/' + sourceDir + '/' + source);
    
            // compute a hash so we can avoid duplicate uploads
            const hash = crypto.createHash('sha256').update(input).digest('hex');
            buildCacheFile[videoName] = hash;
    
            const encSource = encodeURIComponent(source)
            const fileName = encodeURIComponent(path.basename(source))
    
            // don't add type here because its already stored with the bucket
            theModule.push({
                name: videoName,
                source: process.env.DO_SPACE_ENDPOINT + '/' + parsedApp.name.bundle + '/' + fileName
            });
    
            if (existingCache[videoName] == hash) { 
                continue;
            }
    
            // lets upload this video to our digital ocean account
            const bucketParams = {
                Bucket: parsedApp.name.bundle,
                Key: fileName,
                Body: input,
                ACL: 'public-read',
                ContentType: type
            };
    
            let run = async () => {
                try {
                const data = await s3Client.send(new PutObjectCommand(bucketParams));
                
                console.log(
                    "Successfully uploaded object: " +
                    bucketParams.Bucket +
                    "/" +
                    bucketParams.Key
                );
                
                return data;
                } catch (err) {
                console.log("Error", err);
                }
            };    
            await run();   
            console.log('uploaded')

        }

        outputApp.modules.push({ 
            name: moduleName,
            videos: theModule
        })

    }

    // generate a package file that can be directly hosted on digital ocean storage blob
    fs.writeFileSync(__dirname + '/out/userland.json', JSON.stringify(outputApp, ' ', 4), 'utf8')
    fs.mkdirSync(__dirname + '/out/.build')
    fs.writeFileSync(__dirname + '/out/.build/cache.json', JSON.stringify(buildCacheFile, ' ', 4, 'utf8'))

    // output the link to the course contents (which in term references deployed resources)
    async function run2() {
        try {
        const data = await s3Client.send(new PutObjectCommand({
            Bucket: parsedApp.name.bundle,
            Key: 'userland.json',
            Body: JSON.stringify(outputApp, ' ', 4),
            ACL: 'public-read',
            ContentType: 'application/json'
        }));
        return data;
        } catch (err) {
        console.log("Error", err);
        }
    };
    await run2()

    async function run4() {
        try {
            const data = await s3Client.send(new PutObjectCommand({
                Bucket: parsedApp.name.bundle,
                Key: '.build/cache.json',
                Body: JSON.stringify(buildCacheFile, ' ', 4),
                ACL: 'public-read',
                ContentType: 'application/json'
            }));
            return data;
            } catch (err) {
            console.log("Error", err);
        }
    };
    await run4()

    let contents = [ ];
    for (var i = 0; i < outputApp.modules.length; i++) { 
        for (var j = 0; j < outputApp.modules[i].videos.length; j++) { 
            contents.push({ 
                name: outputApp.modules[i].videos[j].name,
                vurl: outputApp.modules[i].videos[j].source,
                url: process.env.DO_SPACE_ENDPOINT + '/' + parsedApp.name.bundle + '/' + i + '.html'
            })
        }
    }

    // render app template using handlebars?
    let templ = handlebars.compile(fs.readFileSync(__dirname + '/mweb/template.html', 'utf8'));
    let htmlOutput = templ({ 
        self_url: process.env.DO_SPACE_ENDPOINT + '/' + parsedApp.name.bundle + '/index.html',
        display: parsedApp.name.display, 
        contents: contents
    })

    // lets build an html page for these video files as well
    // output the link to the course contents (which in term references deployed resources)
    async function run3() {
        try {
        const data = await s3Client.send(new PutObjectCommand({
            Bucket: parsedApp.name.bundle,
            Key: 'index.html',
            Body: htmlOutput,
            ACL: 'public-read',
            ContentType: 'text/html'
        }));
        return data;
        } catch (err) {
        console.log("Error", err);
        }
    };
    await run3()

    // render each of the videos into their own pages
    for (let i = 0; i < contents.length; i++) { 
        
        let c = contents[i]

        // render app template using handlebars?
        let templ = handlebars.compile(fs.readFileSync(__dirname + '/mweb/video-template.html', 'utf8'));
        let htmlOutput = templ({ 
            self_url: process.env.DO_SPACE_ENDPOINT + '/' + parsedApp.name.bundle + '/' + i.toString() + '.html',
            display: c.name, 
            url: c.vurl
        })

        // console.log(htmlOutput)

        // lets build an html page for these video files as well
        // output the link to the course contents (which in term references deployed resources)
        async function run() {
            try {
            const data = await s3Client.send(new PutObjectCommand({
                Bucket: parsedApp.name.bundle,
                Key: i.toString() + '.html',
                Body: htmlOutput,
                ACL: 'public-read',
                ContentType: 'text/html'
            }));
            return data;
            } catch (err) {
            console.log("Error", err);
            }
        };
        await run()

    }

    console.log('web: ' + process.env.DO_SPACE_ENDPOINT + '/' + parsedApp.name.bundle + '/index.html')
    console.log('native: ' + process.env.DO_SPACE_ENDPOINT + '/' + parsedApp.name.bundle + '/userland.json')

})();

