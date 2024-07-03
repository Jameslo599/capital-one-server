# Capital One Banking Clone Server

This project is the back-end portion of the Capital One banking clone, designed to authentically replicate the company's data storage and facilitate the exchange of funds. Key features include an email controller using NodeMailer, form validation with validator.js and creation of secure keys using bcrypt. The server assists with functions such as:

Replicated secure logins with cookie authentication
Chatbot assistance for user queries
Fast password reset system
Form validation with validator.js
Email controller using NodeMailer
Secure key creation with bcrypt
Storing and modifying user data in MongoDB
Secure cookie functionality across desktop and mobile browsers, including private browsing
Profile picture upload and storage in Cloudinary

**Link to project:** https://resilientcoda.com/

![application website](/src/images/coda.webp)

## How It's Made:

**Tech used:** Node.js, Express, MongoDB, Mongoose

This was my first time applying MVC principles to a React application, and it was initially challenging. However, I found a solution by separating the front-end and back-end into distinct servers. This approach allowed me to designate the entire front-end as the 'view' while the back-end handled the 'model' and 'controller' aspects.

I enjoyed learning a wide variety of Node.js modules to enhance my project’s features and complexity. For example, users can upload profile pictures using FileReader and Multer for file submissions. It was my first experience working with user uploads, so I dedicated time to learning about different image types and how to limit sizes to under 1MB to preserve bandwidth and reduce waste.

I chose MongoDB for my model due to its speed and ease of use, requiring only knowledge of object manipulation. To leverage schema features, I used Mongoose with MongoDB. I created three schemas: account, address, and transaction. Separating these schemas improves code readability, and each schema includes the associated account ID, making it easy to retrieve information for the front-end. Additionally, Mongoose is used with express-session to store sessions in the database. If a user has an existing session, a cookie is sent to the backend to be validated against the session storage key in the database. When they match, the user's session is restored.

## Optimizations

## Lessons Learned:
