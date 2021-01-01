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

5. Install the projects' dependencies:
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
### Viewing a Single Artist
1. Type an artist or band name into the search bar at the top and press `Return/Enter` or click the `Search` button.
2. Click on the relevant artist from the list of artists that appears (this will show some information about the selected artist).
3. Once the lyrics have been fetched and calculated, you should see the stats for their work along with a graph showing the names of their top ten songs measured by word count.

### Comparing Artists
You can compare up to three artists side-by-side.
1. After searching for the first artist, click on the `Compare` button.
2. Select which column to insert another artist using the radio buttons below the columns.
3. Search for the next artist and click the relevant item from the list of artists that match the name that has been searched. The chosen column will be populated with information when the data has been collected and the statistics have been computed.

When comparing, each column has the following action buttons:
- `Remove` will clear the artist for that particular column.
- `View` will take you back to the individual view for the selected artist.