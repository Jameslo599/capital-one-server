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

When a user wants to reset their password, they must first verify their account email, last name, and date of birth. This triggers a POST request to the email controller, where bcrypt is used to salt and hash a base36 key, valid for 24 hours. An email is then sent to the user's email address using Nodemailer, containing a link with the secret key. When the user clicks the link, they are directed to a page where the server verifies the key's validity. If the key is valid, the user can submit a PUT request to change their password.

## Optimizations:

I believe some of the async functions in the controllers can be written more succinctly and elegantly. Much of this code was written early on, and my syntax improved throughout the development cycle. Writing cleaner code will enhance readability and potentially improve the overall speed of the back-end.

While I appreciate MVC principles, I'm not sure if they are the best fit when combining React and Express. This approach requires sending multiple fetch requests and responses that otherwise wouldn't be necessary. I'm currently exploring Next.js to see if it addresses this specific issue.

## Lessons Learned:

Enforcing MVC principles was challenging initially, especially since I used React as my frontend framework. I learned to separate the frontend views from the backend model and controller, creating a cohesive system. The only downside was that some modules, like banner popups, didn't work properly by default due to using fetch requests for client-server communication. I overcame this issue by implementing React-toastify, a more elegant and straightforward way to display status notifications and inform users of the results of their requests.
