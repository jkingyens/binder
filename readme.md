# Binder

Binder is a static site compiler that takes course resources (videos to start) and generates a mobile-friendly website for viewing the material. This helps students access online course material on the go. The compiler could be used by the course instruction/author or by students taking the course if they can download/extract course videos. The compiler depends on Digital Ocean Spaces for deployment to publically accessible links. Please only share course links with other students enrolled in the course if it's a paid course.

# Install

```
npm install -g binder
```

# Setup

1. Create or sign into your account on Digital Ocean

2. Create a new space from the Digital Ocean developer console.

3. Copy the endpoint URL and save it to a file called .env in this repo folder. Example:

```
DO_SPACE_ENDPOINT=https://nyc3.digitaloceanspaces.com
```

4. Create a key/secret pair for this space and add it to the .env file created above. Example:

```
DO_SPACE_KEY=DO00CE96V9TKWYEXHA6W
DO_SPACE_SECRET=uAJYxWaawOPN6J6pQkavNhuYd7QQh/+VmOjI/NWv+HQ
```

# Defining a Course

Defining a course is easy. It's just a JSON file that tells binder the general navigation hierarchy of your content and gives it basic meta data, like a friendly name, the type of file it is, etc. Example:

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

# Build & Deploy

To deploy the course, ensure all of the resources exists in your local filesystem. Then run: 

```
binder <program source directory>
```

The compiler will generate a bundle and publish it to cloud storage on digital ocean. For example: 

```
https://nyc3.digitaloceanspaces.com/rh-ntp/binder.html
```
