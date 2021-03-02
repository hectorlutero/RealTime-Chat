# RealTime Chat
 A realtime chat project made in Node.js


A modern way to build an application with Node.js.
Bullet point code       = alt + 0149
triangular bullet point = alt + 8227

baby steps

    install node

    create a package.json file on the root folder by using: npm init

    what we need?
        express (framework)
        socket.io(Library to deal with websockets)
        moment (date and time formatter)
        nodemon (to update the page every update is made) -D dev dependency required just for build the application

        npm install express socket.io moment
        and
        npm install -D nodemon (uppercase -D means devdependency)

        changing the package.json
            we don't need at scripts, the "test", change for "start".

            "start": "node server"
            "dev": "nodemon server"

        Create a regular server
        
        at server.js
            const express = require('express');
            const app = express();
            
            const PORT = 300 || process.env.PORT (this process.env.PORT is required if you're trying to run your server on some host that doesn't allow you to run on the port you want.)

            app.listen(PORT, () => console.log(`server running on port ${PORT}`));

        Create your Static Folder

            You'll need a static folder to access the frontend

            at the beginning you'll need the "path" module.

            const path = require('path');

            and then, you can set the directory of your static folder

            app.use(express.static(path.join(__dirname, 'public')));

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

        - Set the server (To handle Socket.Io)

            const http      = require('http');
            const socketio  = require('socket.io');

            const app = express();
            const server    = http.createServer(app);
            const io        = socketio(server)
            
            ## Run the websocket when the clients connects, everytime the client refresh a new WS connection will be set.
            io.on('connection', socket => {
                console.log('New WS Connection...')
            });

            ## in the HTML file, writes a script tag with src="/socket.io/socket.io.js" to use the library on the front-end.
            ## don't forget to link the main.js too
            
const            We have to access the io method through the main.js, and define the socket package
            at main.js file:

                const socket = io();

            Every time someone refresh the page a new WS connection will be set.

        - Message from the server to the client
            
            on the server.js file

                inside io.on() you can send messages to the client through:
                
                    socket.emit('message', 'Welcome new comer');

            ## the way to you be able to display this message on the front is through the main.js.

            socket.on('message', message => {
                console.log(message);
            });

            ## Broadcast when a user connects
                ##the reason we use broadcast, is that this will be displayed to everybody excepts to the user connected. we don't need to notify the user that he's connecting
            socket.broadcast.emit();

                    Ex.: • Only the Client - socket.emit()
                         • All, excepts the user logged in - socket.broadcast.emit();
                         • All clients - io.emit()
            ## Broadcast run when the client disconnets
                socket.on('disconnect', () => {
                    io.emit('message', 'A user has left the chat.');
                });
            
            ## Styling and bringing to the DOM

                const chatForm = document.getElementById('chat-form');

                ## Create an event listener to listemn to the form
                
                chatForm.addEventListener('submit', (e) => {
                    ## when you submits a form it automatically submits it to a file, and we don't want this to happen, for that we prevent the event default behavior.
                    e.preventDefault();

                    ## We need to get the text input, grabbing from the DOM for example, but we also can try, is using "e.target" that gets the current element, and we have access to elements and we get "id" that we want to use, can be msg, or text, whatever you want. And finally you get the value through ".value".

                    const msg = e.target.elements.msg.value;
                    //console.log(msg);
                    socket.emit('chatMessage', msg);
                });

                ##On the server side
                Listen for Chat Message on the server
                socket.on('chatMessage', msg => {
                    //console.log(msg);
                    io.emit('chatMessage', msg);
                })

                ## That will console log the message, to display it on the front we have to change the previous code on main.js.

                socket.on('message', message => {
                    //console.log(message);

                    ## Now comes the DOM Manipulation, we'll do with vanilla JS.

                    outputMessage(message);
                });
                // output message to DOM
                function outputMessage(message) {
                    const div = document.createElement('div');
                    div.classList.add('message');
                    div.innerHTML = `<p>${message}</p>`;
                    document.querySelector('.chat-message').appendChild(div);
                }

            - Small Implementations
                ## Scroll down everytime a new message arrives

                ## on main.js, at the socket.on('message' message =>{})
                const chatMessages = document.querySelector('.chat-messages');

                // Scroll down
                chatMessages.scrollTop = chatMessages.scrollHeight;

                
                // clear input
                ## After you emit message to the server at chatForm.addEventListener('submit', e => {})

                e.target.elements.msg.value = '';
                ## Right after the message is sent, and the input text is cleared, we call to focus to the input text again to type a new message again.
                e.target.elements.msg.focus();

            - Formatting the Messages

                ## First lets create a new folder on the root, called utils with a file called messages.js, create a function to format the message
                
                const moment = require('moment');

                fucntion formatMessage(username, text) {
                    return {
                        username,
                        text,
                        ## we need to update the time
                        time: moment().format('h:mm a');
                    }
                }

                ## we need to export this using
                module.exports = formatMessage;

                ## Get back to server.js file and import the module

                const formatMessage = require('./utils/messages.js');

                ## On io.on('connection', socket => {}), when the welcome message will be emit to the user, we can call the const formatMessage with the parameters "user" and "message";
                    socket.emit('message', formatMessage('ChatBot', 'Welcome to SimanChat'));

                ## We want to make the same thing with each message from the server.
                
                ## However, now we are not sending a string like before, bu an object, in order to the output display the text instead of object, we need to go to the main.js.

                `<p>${message.username}`;
                `<p>${message.text}`;
                `<p>${message.time}`;

            - Implement Users and Rooms

                ## In order to get the username and the room, we can get those using the query strings on the URL given by form action using GET method.

                ## There's a library which we can install to get those queries: qs cdn

                ## copy the script tag cdn and paste on the html file.

                ## The way you get the values is right above the in the main.js file. and there's a way to ignore the symbols through "ignoreQueryPrefix: true" 
                // Get username and room from URL
                const {username, room} = Qs.parse(location.search, {
                    ignoreQueryPrefix: true
                });

                console.log(username, room);

                ## to display on the front, first we need to go back to the server.js;

                io.on -> socket.on('joinRoom', ({ username, room }) => {

                    ## You can create a database, or create a file on utils called users.js.
                    const users = [];

                        // Join user to chat
                        function userJoin(id, username, room) {
                            const user = { id, username, room };
                            users.push(user);

                            return user;
                        }

                        // get current user
                        function getCurrentUser(id) {
                            return users.find(user => user.id === id);
                        }

                        ## Export the module
                        module.exports = {
                            userJoin,
                            getCurrentUser
                        };

                        ## import this to server.js
                        const {userJoin, getCurrentUser} = require('./utils/users.js');

                    ## The welcome message will be displayed in here. 
                    const user = userJoin(socket.id, username, room);

                    socket.join(user.room);

                })

                ## At the broadcast when the user connects, that's the way you broadcast message to a specific room.
                socket.broadcast.to(user.room).emit();

                ## and instead of saying "User has joined/left the chat" change for `${user.username} has joined/left the chat`.

                ## With the users' message itself we can do:
                // listen for chatMessage
                socket.on('chatMessage', msg => {
                    const user = getCurrentUser(socket.id);

                    // make the change on io.emit to
                    io.to(user.room).emit('message', formatMessage(user.username, msg));

                });

                ## Now for doing the same for user leaves the chat. at users.js

                // User leaves chat
                function userLeave(id) {
                    ## we gotta find the user id on the array users.
                    const index = users.findIndex(user => user.id === id);

                    ## We do that because if it not find the id it returns -1, if it not returns -1, that's because it has found the id..... AND INSTEAD OF RETURNING THE ENTIRE ARRAY, RETURN THE USER THROUGH [0] 
                    if(index !== 1) {
                        return users.splice(index, 1)[0];
                    }
                }

                // Get room users
                function getRoomUsers(room) {
                    return users.filter(user => user.room === room);
                }

                ##Export those
                module.exports = {
                            userJoin,
                            getCurrentUser,
                            userLeave,
                            getRoomUsers
                        };

                ## import this to server.js
                const { userJoin,
                        getCurrentUser,
                        userLeave,
                        getRoomUsers } = require('./utils/users.js');

                //Join chat room
                socket.emit('joinRoom', {username, room});

            ## When the user disconnects server.js
            // runs when client disconnects
            socket.on('disconnect', () => {
                const user = userLeave(socket.id);

                if(user) {
                    io.to(user.room).emit('message', formatMessage('Chat Bot', `${user.username} has left the chat.`);
                }
            })

        ## Now we gonna bring the info of users connected and rooms available, and this means to do it dinamically on server.js
        // send users and room info (which users are connected and which user exist)
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

        

        // runs when client disconnects
        socket.on('disconnect', () => {
            if(user) {
                // right after the left the chat

                // send users and room info (which users are connected and which user exist)
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room)
                });
            }
        });

        ## Going back to main.js

        // Get Room and Users
        socket.on('roomUsers', ({ room, users }) => {
            outputRoomName(room);
            outputUsers(users);
        })


        ## Bring to the DOM
        // Getting Elements(id's and classes)
        const roomName = document.getElementById('room-name');
        const userList = document.getElementById('users');

        // create the functions right down the bottom
        // Add room name to DOM
        function outputRoomName(room) {
            roomName.innerText = room;

        }

        // Add users to DOM
        function outputUsers(users) {
            ## For users it's complicated because is an array, so you have to do it in a special way, DON'T FORGET THE JOIN AFTER MAPPING THROUGH THE ARRAY.
            userList.innerHTML = `
                ${users.map(user => `<li>${user.username</li>}`).join('')}
            `;
        }

