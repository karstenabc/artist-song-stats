## About
This is a NextJS project that allows you to search for an artist and see some statistics on their work.

## Set Up
To set the project up locally, please complete the following steps:

1. Make sure your system has [Node.js](https://nodejs.org/en/) 10.13 or later. If you need to install NodeJS, on Ubuntu, run:
```bash
sudo apt install nodejs
```
To check the install succeeded, run:
```bash
node -v
```
This should show the currently installed NodeJS version, eg: `v10.19.0`.


2. You will then need to install the Node Package Manager (NPM), for Ubuntu, run the following:
```bash
sudo apt install npm
```

3. Once NPM has been installed, clone this project from [Github](https://github.com/karstenabc/artist-song-stats) by running the following command:
```bash
git clone https://github.com/karstenabc/artist-song-stats.git
```

4. Enter into the project directory:
```bash
cd artist-song-stats
```

5. Install the projects' dependancies:
```bash
npm install
```

6. Finally, run the development server:
```bash
npm run dev (if you have followed the above instructions)
# or
yarn dev (if your system is set up with yarn)
```

7. Open [http://localhost:3000](http://localhost:3000) with your browser.


## Usage
1. Type an artist or band name into the search bar at the top and press `Return/Enter` or click the `Search` button.
2. Click on the relevant artist from the list of artists that appears (this will show some information about the selected artist).
3. Once the lyrics have been fetched and calculated, you should see the stats for their work.