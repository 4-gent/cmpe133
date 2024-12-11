# RadioHost Project README

Please read this thoroughly to understand how to get things started. No matter what part you're working on, read the entire document. If you have any questions, reach out to Mj.

**Note:** Starting code has been made and commented for your reference to help you understand how communication between frontend and backend works and how the project works.

## Getting Started with Yarn Package Management

Yarn Package Manager allows you to install packages needed for web development, launch development servers, build projects into production builds, and much more.

**Note:** I highly recommend using Yarn for package management, but you are welcome to use npm or npx as well.

### How to Install Yarn Globally

#### Linux Environments

1. Update packages and install upgrades:
    ```bash
    sudo apt-get update && sudo apt-get full-upgrade -y
    ```
2. Install npm to install Yarn globally:
    ```bash
    sudo apt-get install npm -y
    sudo npm install -g yarn
    ```

#### macOS Environments

1. Install Homebrew (macOS package installer):
    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

2. Install Yarn globally:
    ```bash
    brew install yarn
    ```

#### Windows Environments

1. If you do not have WSL/Bash on Windows (recommended), use the link below to install Yarn:
    [Yarn Installation for Windows](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)

## Getting Started with Frontend

Frontend development is done using React.js, which combines JavaScript with HTML and CSS.

### Directory Structure
```
radiohost
├── node_modules        # Installed npm packages (make sure .gitignore ignores this)
├── public              # Public assets (don’t worry about this)
└── src
    ├── components      # Reusable components (e.g., buttons)
    ├── styles          # CSS/styles and images
    ├── routes          # Additional webpages
    ├── main.js         # Home page JS file
    ├── App.js          # BrowserRouter routing file
    └── index.js        # Entry point (don’t modify this)
├── package.json        # Project blueprint and dependencies
└── .gitignore          # Ensure node_modules is ignored
```

### How to Get It Running

1. **`cd`** into the `radiohost` folder.

2. Run **`yarn install`** (**`sudo yarn install`** on Unix-based systems) to download packages specified in `package.json`.

3. Start the development server by running **`yarn start`** (or **`sudo yarn start`**). The server will start at **`http://localhost:3000`**.

    - As you code and make updates, it will compile and show you runtime errors/changes as you develop.

**Note:** Remember to update the BrowserRouter in `App.js` to ensure the application recognizes the new page you create.

## Getting Started with Backend

Backend development is done with Node.js, which communicates with MongoDB Atlas for a relational database.

- `main.js` will be the main backend file (keep the routing and everything in this one file for a cleaner web server instead of jumping between files).

- `api.js` (name is subject to change) will be where we handle tasks like GPT API calls or Spotify API calls.

**Note:** Connection to the database requires environment variables stored in a `.env` file and accessed using `process.env.[Variable Name]`. Ask Mj for access if you do not have it already.

### How to Get It Running

1. You will be using Yarn for the backend as well.

2. Install the required packages:
    ```bash
    yarn install
    ```
    or
    ```bash
    sudo yarn install
    ```

3. Start the backend server:
    ```bash
    yarn start
    ```
    or
    ```bash
    sudo yarn start
    ```
4. API Keys:
   - This application uses MongoDB Atlas for storage, you will need to make an Atlas account, a cluster, and grab the URI and other relevant keys and store them in a .env
   - This application also uses the Spotify Developer API, you will need to make a developer account that ties to a premium spotify account in order to run music, those keys will also be placed into the .env
- As you code and make updates, it will compile and show you runtime errors/changes as you develop.
  
## Getting Started with Flask Server

1. **`cd`** into the `flask-server` folder
   
2. Install the required packages

    ```bash
    pip install -r requirements.txt
     ```
   

3. Start the flask server:
    ```bash
    python3 app.py
     ```
4. API Keys:
   - This application uses OpenAI and Tavily, you will need to make respective accounts and get API keys for the .env in the flask-server directory
   - This application also uses the Spotify Developer API, you will need to make a developer account that ties to a premium spotify account in order to run music, those keys will also be placed into the .env

## Getting Started with the OpenAI

1. Go to https://platform.openai.com/docs/overview

2. Travel to dashboard and create a project.

3. Acquire API key for the project
