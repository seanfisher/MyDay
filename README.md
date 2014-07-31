# MyDay

Simple Appcelerator Titanium mobile app to provide weather, an inspirational quote, and a breakfast suggestion.

## Description

This app was originally built as a demo app for a presentation to developers at [Pariveda Solutions](www.parivedasolutions.com) during the _Houston Learning Series_ event by [@seanfisher](https://github.com/seanfisher) and [@mmnaviwala](https://github.com/mmnaviwala).

## Setup

1. Install [Appcelerator's Titanium Studio](http://www.appcelerator.com/titanium/titanium-studio/)
2. Install the Android and _(optionally)_ the iOS SDKs on your local machine. Titanium Studio has a wizard to allow you to do this
3. Import this project as an existing mobile project into Titanium Studio
4. Sign up for the Yelp! API and put your keys into `app/controllers/myDay.js`. Search for `---CONSUMER-KEY-HERE---` to find where to put in the Yelp keys.

## Features

This app demonstrates a number of Titanium features, including:

- Using the HTTP client to access third-party APIs
- Getting the device's location through the Titanium API
- Using local assets such as image files
- A basic view-controller
