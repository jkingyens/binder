# Binder

Binder is a compiler that bundles a set of videos into a course program. The compiler deploys the course to your Digital Ocean account via the Spaces API. You can then load and run the program using our native iOS or Android apps called Userland. Userland supports features such as progress tracking, offline caching and more coming soon. Alternatively, you can view the videos via generated html pages based on the OpenJS Foundation's [AMP project](https://amp.dev).

# Defining a Course

A course is specified in JSON. Videos are sourced off the local filesystem with path relative to spec file.
Here is a sample with just one module and one video file:

```
{ 
    "name": { 
        "bundle": "neuro-training",
        "display": "The Positive Neuroplasticity Training"
    },
    "author": "Rick Hanson",
    "version": "0.1.0",
    "modules": { 
        "The Essence of Postiive Neuroplasticity": {
            "Welcome and Introduction": { 
                "type": "video/mp4",
                "path": "PNT Class 1, Part 1.mp4"
            }
        }
    }
}
```

# Deploying the Course

To compile the course and deploy to Digital Ocean: 

```
binder path/to/mycourse.json
```

If there are no errors, the compiler will return a link to access the course material:

```
https://nyc3.digitaloceanspaces.com/<bundle name>/index.html
```

# Example Courses

To test the compiler out, I built 3 courses I've taken in the past. The JSON specifications for these coureses are availalble in the examples directory. The video files are not here because the content is owned by the authors of the videos.

### 1. The Positive Neuroplasticity Training

[This course](https://courses.rickhanson.net/courses/the-positive-neuroplasticity-training) allowed me to download offline copies of the videos in mp4 format so I could run my compiler directly on those files. [Binder file](examples/neuro-training/binder.json).

### 2. Write of Passage

[This course](https://writeofpassage.school) uses Wistia as it's learning management system (LMS). I was able to find a [Wistia video downloader chrome extension](https://chrome.google.com/webstore/detail/wistia-video-downloader/acbiaofoeebeinacmcknopaikmecdehl?hl=en) and pull copies of the videos in mp4 format. [Binder file](examples/write-of-passage/binder.json).

### 3. Startup School Curriculum

The videos for [this course](https://www.startupschool.org/curriculum) are hosted on Youtube so I used [pytube](https://pytube.io/en/latest/) to dump each of the videos to mp4 format and ran them through the compiler. [Binder file](examples/yc-startup-school/binder.json).

# Install

```
npm install -g course-binder
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

# Userland Apps

## iOS

[Source Code](ios/Userland) inside this repo.
Load project file in XCode and hit the build button.
App Store listing coming soon.

## Android

[Source Code](android/) inside this repo.
Load project folder in Android Studio and hit the build button.
Play Store listing coming soon.