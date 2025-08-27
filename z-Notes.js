/*
----Vite----
    Vite is a front-end build tool that significantly improves the development experience. Its primary purpose is to serve your
    web pages and bundle your code for production. It uses a modern approach called native ES modules to serve your code directly
    to the browser, which makes it incredibly fast.

    How It Works
    During development, Vite acts as a simple web server. When your browser requests a file, Vite doesn't bundle the entire application.
        Instead, it serves the file directly and processes it on the fly. This makes it much faster than traditional bundlers like
        Webpack. For a production build, Vite compiles and optimizes all your code into a dist folder, which is ready to be deployed to a web server.


    Installation and Usage
    To get started with Vite, you need to have Node.js and npm installed on your computer. See farther down for how to install Node

        1. Create a Project: Open your terminal and run the following command. This will create a new project folder with all the necessary files.
            npm create vite@latest

        2. Navigate and Install Dependencies: Move into the new project folder and install the required packages.
            cd <your-project-name>
            npm install

        3. Select your framework as vanilla and Javascript as the variant.

        4. Start the Server: To start the development server, run:
            npm run dev
        This command will give you a local URL (e.g., http://localhost:5173) that you can open in your browser to see your application running.

    Important Information
    No Express Needed for the Front End: Vite acts as its own web server for development. You do not need a separate Express server to serve your HTML and JavaScript files.

    Environment Variables: Vite uses a special way to handle environment variables. They must be prefixed with VITE_ and accessed in your code via import.meta.env.

    Production Build: When your application is ready to be deployed, you run npm run build. This creates a highly optimized dist folder that contains your
        entire application, which you can then upload to any static web hosting service.

----Git-Hub and Git Pages----
    To connect my project to git-hub, follow to below steps
    1. Open the proejct folder in computers terminal and run the following commands
        1.1 npm install gh-pages --save-dev
        1.2 Then add a deploy script to the package.json function
            "scripts": {
                "dev": "vite",
                "build": "vite build",
                "preview": "vite preview",
                "deploy": "gh-pages -d dist"
                }
        1.3 Configure git identity to connect to git-hun
            git config --global user.name "User Name Here"
            git config --globae user.email "Your Email Here"
        1.4 Add the git remote repository
            git remote set-url origin https://github.com/your-username/your-new-repository-name.git
            you might need to remove and readd origin if it doesn't work
                git remote remove origin
                git remote add origin https://github.com/your-username/your-repository-name.git
        1.5 If you have multiple pages needed for a git-pages, make sure all html files are in the same first folder and have this in a
            vite.config.js file
                import { defineConfig } from 'vite';
                export default defineConfig({
                    base: '/qc-dashboard2/',
                    build: {
                        rollupOptions: {
                        input: {
                            main: 'index.html',
                            pm: 'pmPage.html',
                        },
                        },
                    },
                });
            
            The input options tell it what files to take when creating the vite npm run build function

    2. Once installed and connected, you can use Vite by typing
        npm run build
        to create a build version of your project that can be used by git-pages

    3. Once that is done and everyhting else is connected, you can type
        npm run deploy
        to deploy the build version of the project

----Node----
    How To Use:
        1. To open the server, press  Windows Key + R and type in "cmd"
        2. Once that opens, go to the folder directory for this project and type "npm init -y" and press enter.
        3. After that runs, type "npm install express" and press enter.
        4. These will install files called "package.json", "package-lock.json", and the folder "node_modules" that runs Node

----Supabase----
    Good youtube video is saved for how to connect. See that and .env and loginPage.js for working examples.

*/