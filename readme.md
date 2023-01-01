# Binder

Binder is a static site compiler that takes a list of course videos and generates a mobile-friendly website for viewing the material. The compiler can be used by the course author or student. You just need to get the course videos on your local filesystem. The compiler then deploys the course to Digital Ocean via the Spaces API.

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

A course is just a JSON file with filesystem references to video content along with course metadata.

```
{ 
    "name": { 
        "bundle": "neuro-training",
        "display": "The Positive Neuroplasticity Training"
    },
    "author": "Rick Hanson",
    "version": "0.1.0",
    "contents": { 
        "Class 1": { 
            "type": "video/mp4",
            "source": "PNT Class 1, Part 1.mp4"
        }
    }
}
```

# Deploying the Course

To compile the course from source material and deploy to public cloud: 

```
binder <path to course JSON file>
```

If there are no errors, the compiler will return a link to access the course material. Ex: 

```
https://nyc3.digitaloceanspaces.com/rh-ntp/binder.html
```
If you are compiling a paid course as a student, please only share links with other enrolled students
