# Shopify-Challenge-2022
A simple inventory tracking website with basic CRUD functionality built in Node.js and React for Shopify's Backend Developer Challenge.

## Introduction

[Backend](https://github.com/kaiznanji/Shopify-Challenge-2022/tree/master/backend): Built in Node.js the backend utilizes MongoDB to store inventory items with an item name, quantity, cost, and pre-selected tags. I have built a series of API calls that are able to view, create, edit, and delete inventory items, as well as filter and sort through them.

[Frontend](https://github.com/kaiznanji/Shopify-Challenge-2022/tree/master/frontend): Built in React the frontend utilizes Bootstrap to create a clean and easy to read interface.

<p align="center">
  <img src="https://github.com/kaiznanji/Shopify-Challenge-2022/tree/master/images/frontend.png?raw=true",width=550,height=450/>
</p>


## Getting started

Use the following link to ensure you have npm and node.js installed: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm.

To test if you have successfully installed them run the following commands:

```bash
node -v
npm -v
```

After cloning this git repository and navigating to the project directory, in order to start this project you will need to ensure the following commands are run:

To start the backend server:
```bash
cd backend
npm install
npm start
```

Make sure you navigate outside of the backend directory using ```cd ..``` before running the next commands:

To start the frontend server:
```bash
cd frontend
npm install
npm start
```

After the server spins up make sure you navigate on your browser to "http://localhost:3000". Now you can create inventory items!

