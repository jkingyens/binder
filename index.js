import fs from 'fs';
import { S3 } from "@aws-sdk/client-s3";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';

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

// parse the test file 

let app = fs.readFileSync(__dirname + '/test/binder.json')
let parsedApp = JSON.parse(app)
let outputApp = { } 

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
    console.log(d)
})

import { PutObjectCommand } from "@aws-sdk/client-s3";

// iterate over the keys of contents
outputApp.contents = { }
let keys = Object.keys(parsedApp.contents)
for (let i = 0; i < keys.length; i++) { 
    
    let v = keys[i]
    let name = v;
    let type = parsedApp.contents[v].type
    let source = parsedApp.contents[v].source

    // lets upload this video to our digital ocean account
    const bucketParams = {
        Bucket: parsedApp.name.bundle,
        Key: source,
        Body: fs.readFileSync(__dirname + '/test/' + source),
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
    run();

    // don't add type here because its already stored with the bucket
    outputApp.contents[v] = { 
        source: process.env.DO_SPACE_ENDPOINT + '/' + parsedApp.name.bundle + '/' + source,
        name: source.replace('.mp4', '')
    }

}

// generate a package file that can be directly hosted on digital ocean storage blob

fs.writeFileSync(__dirname + '/out/binder.json', JSON.stringify(outputApp, ' ', 4), 'utf8')

// output the link to the course contents (which in term references deployed resources)
async function run2() {
    try {
    const data = await s3Client.send(new PutObjectCommand({
        Bucket: parsedApp.name.bundle,
        Key: 'binder.json',
        Body: JSON.stringify(outputApp, ' ', 4),
        ACL: 'public-read',
        ContentType: 'application/json'
    }));
    return data;
    } catch (err) {
    console.log("Error", err);
    }
};
run2()

console.log(process.env.DO_SPACE_ENDPOINT + '/' + parsedApp.name.bundle + '/binder.json')

let contents = [ ];
Object.keys(outputApp.contents).forEach( function (v, i) { 
    contents.push({ 
        vurl: outputApp.contents[v].source,
        url: process.env.DO_SPACE_ENDPOINT + '/' + parsedApp.name.bundle + '/' + i + '.html',
        name: outputApp.contents[v].name
    })
})

// render app template using handlebars?
let templ = handlebars.compile(fs.readFileSync(__dirname + '/template.html', 'utf8'));
let htmlOutput = templ({ 
    self_url: process.env.DO_SPACE_ENDPOINT + '/' + parsedApp.name.bundle + '/binder.html',
    display: parsedApp.name.display, 
    contents: contents
})

// console.log(htmlOutput)

// lets build an html page for these video files as well
// output the link to the course contents (which in term references deployed resources)
async function run3() {
    try {
    const data = await s3Client.send(new PutObjectCommand({
        Bucket: parsedApp.name.bundle,
        Key: 'binder.html',
        Body: htmlOutput,
        ACL: 'public-read',
        ContentType: 'text/html'
    }));
    return data;
    } catch (err) {
    console.log("Error", err);
    }
};
run3()

// render each of the videos into their own pages
contents.forEach(function (c, i) { 

    // render app template using handlebars?
    let templ = handlebars.compile(fs.readFileSync(__dirname + '/video-template.html', 'utf8'));
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
    run()

});


console.log(process.env.DO_SPACE_ENDPOINT + '/' + parsedApp.name.bundle + '/binder.html')
