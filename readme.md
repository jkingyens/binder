# Binder

Binder is a static site compiler that takes course resources (videos to start) and generates a mobile-friendly website for viewing the material. This helps students access online course material on the go. The compiler could be used by the course instruction/author or by students taking the course if they can download/extract course videos. The compiler depends on Digital Ocean Spaces for deployment to publically accessible links. Please only share course links with other students enrolled in the course if it's a paid course.

# Install

```
npm install -g binder
```

# Setup

1. Create or sign into your account on Digital Ocean

2. Create a new space from the Digital Ocean developer console.

3. Set the Digital Ocean Space endpoint, key and secret in your environment:

```
DO_SPACE_ENDPOINT=https://nyc3.digitaloceanspaces.com
DO_SPACE_KEY=DO00CE96V9TKWYEXHA6W
DO_SPACE_SECRET=uAJYxWaawOPN6J6pQkavNhuYd7QQh/+VmOjI/NWv+HQ
```

# Defining a Course

A course is just a JSON file with metadata along with pointers to the resources that make up the course ie) videos.

```
{ 
    "name": "The Positive Neuroplasticity Training",
    "author": "Rick Hanson",
    "version": "0.1.0",
    "contents": { 
        "Class 1": { 
            "type": "mp4",
            "path": "PNT Class 1, Part 1.mp4"
        }
    }
}
```

# Deploying a Course

To compile the course from source material and deploy to public cloud: 

```
binder <course JSON file>
```

The compiler will generate a bundle and publish it to cloud storage on digital ocean. For example: 

```
https://nyc3.digitaloceanspaces.com/rh-ntp/binder.html
```
