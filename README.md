# A Wedding Planner Demo Site
This is a demo site for a wedding planner workflow.  It is consisted of a React front end utilizing React Query and a CMS that is built in PHP.  For the back end, I did use PhP Flight (https://flightphp.com/) since it is very minimal.  

YouTube Demo Video:  https://youtu.be/lsPaQZmQ8Lk

# Application Requirements
- Node >= v16
- Docker >= v20
- Docker CLI >= v2.0

# How to Run the Application
- First things first, you need to `cd` into in the working folder and run `npm install` to gather all the dependencies.  This project was written with as few libraries as possible, so this process should be really quick.                
- Run `docker compose build`, then, after the build process is complete, run `docker compose up`.  Once the back end is ready, you will see this line: `wedding-planner-db-1   | {some_generated_timestamp} 0 [System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections. Version: '8.0.32'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server - GPL.`
- Once the back end is up and running, you can then, in a separate terminal window, run `npm run dev`.  

In order for you get into the back end CMS, you will need to create a new user through PostMan or something similar.  Use the createUser endpoint to create your user.  I have included my PostMan project in the `postman_collection` directory. 

- NOTE:  Don't forget to run `docker compose down` once you are done.  Not doing so, can leave containers running without the ability to close them. 