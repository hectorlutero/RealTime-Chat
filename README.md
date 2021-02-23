# RealTime Chat
 A realtime chat project made in Node.js


A modern way to build an application with Node.js.

Steps

    Installation Terminal
        - npm init

        - name, description, entry point(server.js), author, license (MIT, GPLv2)

        * Framework 
        - npm install express socket.io moment
            ## Nodemon is used to not have to restart the server everytime you make a change.
        - npm install -D nodemon

        - at package.json, change scripts>test to "start": "node server.js",
        "dev": "nodemon server.js"

    Creating Files
        - server.js
            ## Bringing Express
            const express = require('express');
            const app = express();
            ## It looks if we have an enviroment port and use it instead of 3000.
            const PORT = 3000 || process.env.PORT;
            
            app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));

            run at terminal: npm run dev

        ## To access the html folders of the website.
        - Set Static Folder
            ## We can set some folder as a static folder, where will display the front-end. to do that:

            const path = require('path');

            ## here we give the directory where the folder is, in this case the folder name is 'public'.
            
            app.use(expres.static(path.join(__dirname, 'public')));

        

