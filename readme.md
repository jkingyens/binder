# Binder

Binder is a static site compiler that takes course resources (videos to start) and generates a mobile-friendly website for viewing the material. This helps students access online course material on the go. The compiler could be used by the course instruction/author or by students taking the course if they can download/extract course videos. The compiler depends on Digital Ocean Spaces for deployment to publically accessible links. 

# Install

```
npm install -g binder
```

# Setup

1. [Get an account](https://cloud.digitalocean.com/registrations/new) on Digital Ocean

2. Create access tokens for Spaces API [from the dev console](https://cloud.digitalocean.com/account/api/tokens)

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
binder <path to course JSON file>
```

If there are no errors, the compiler will return a link to access the course material. Ex: 

```
https://nyc3.digitaloceanspaces.com/rh-ntp/binder.html
```
If you are compiling a paid course as a student, please only share links with other enrolled students
