# Binder

Binder is a compiler that takes online course cirriculum (videos, audio and pdf) and deploys it into a user experience that is designed for actual users taking the course. Chances are, if you are taking an online class over the internet, it is being served by a learning management system (LMS) that was designed for the teacher it was being sold to. We provide a tool that empowers the user to get the experience they want. Learning new things is hard enough. The user should not have to fight the software or the platforms that access the content to make progress. 

# Who is it for?

Binder is made for teachers who want to make their own course material more accessible on mobile devices. It is also possible for students taking classes to package course material for a class they are taking and share it with other students taking the class. In this case, we recommend working with your teacher to make things official though. The goal is that if you have access to the course material and $5/mo to create a digital ocean space, you should be able to package the material in a simple way.

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

# Deploying the Course

Once you have defined the course, you will want to pass it through the compiler. Before deploying to digital ocean the compiler will validate the package for errors and issues that could arise. if the package passes validation than the program will be uploaded and you will receive a link that can be used to view the course on the web:

https://nyc3.digitaloceanspaces.com/rh-ntp/0.1.0

The underlying web format is based on Google's AMP project. We chose this because it is a simple and mobile friendly format based on HTML, making it compatible with web browsers today. 

# Native Clients

In addition to consuming course content on the web via published AMP pages, we have native apps for Android and iOS:

iOS native client (source, app store link)
Android native client (source, app store link)
