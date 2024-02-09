# CV Builder
## Uses ChatGPT to create a nice CV and lays it out in PDF format

You enter some basic info on a web form and ChatGPT (OpenAI) creates your CV for you.

### Prerequisites
- The `.env` file. `npm start` will touch the `.env` file at the root of the server app, which is the `./server/` directory (it creates it if it is not there). Then, add an API key from [OpenAI's website](https://platform.openai.com/) to the `.env` file. The format is:
  ```
  OPENAI_API_SECRET_KEY=enter-your-actual-key-here
  ```
  You can also add in `PORT` and `HOST` keys like this:
  ```
  HOST=localhost
  PORT=4000
  ```
  If you do not add these `HOST` and `PORT` keys the code will default to `localhost` and `4000`, respectively. If you do not add the OpenAI API secret key then Nodemon, which runs the server, will fail to start properly but will not exit. If you put the key into the `.env` file and save the `index.js` file, Nodemon will restart successfully.
- `npm start` will create a new, empty `./server/uploads/` directory where your pictures will be uploaded.

 ### Running the app
Start the server first by `cd`'ing into the `./server/` directory: 
```zsh
cd ./server/
npm start
```
... and then start the client:
```
cd ../client/
npm run build
serve -s build
```
Then head over to HTTP://localhost:3000 in your browser.
