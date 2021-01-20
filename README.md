# Nimbella Actions for Postman Collections

## Introduction

If you write RESTful APIs, Postman is an indispensable tool. With millions of users, it has become the default tool of choice for developing, testing, collaborating, documenting, and maintaining RESTful APIs.

If you create/maintain Postman collections, with Postman Actions, getting a taste of serverless was never easier. It is aimed at Postman users like you, it enables you to take your APIs into a serverless world seamlessly with automated code stub generation and auto-deployment. Along with the code stub, the generated project structure also contains Unit Tests, Postman Tests (updated in the collection document), Client Code, and Nimbella Project Configuration File.

## Salient Features
- Generate Nimbella Project Structure with stubs, unit tests, and client code
- Generate language-specific project configuration, package/dependency management, and .gitignore files
- Generate Readme using collection description
- Update dummy API endpoints or non-existent URLs in collection document with Nimbella namespace URLs that - you get post-deployment
- Augment collection document with new Postman Tests
- Sync the updated collection to Postman Cloud
- Auto conversion of version 1.0 collection into version 2.0
- Post-deployment, example responses in the collection can be fetched from deployed URLs
- Synced collection document gets updated in the Postman App

## Available Packages & Actions
### [Project](packages/project)
Create serverless project from a Postman Collection -

- [create](packages/project/create) - Upload to Github and invite others for collaboration
- [deploy](packages/project/deploy) - Deploy to Nimbella and share live URLS, returning JSON response

### [Collections](packages/collections)
Manage Postman Collections - 

- [create](packages/collections/create)
- [delete](packages/collections/delete) 
- [fork](packages/collections/fork)
- [getAll](packages/collections/getAll)
- [getSingle](packages/collections/getSingle)
- [merge](packages/collections/merge)
- [update](packages/collections/update)

---