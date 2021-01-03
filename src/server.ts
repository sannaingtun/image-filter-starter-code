import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );  
  
  app.get( "/filteredimage?", async ( req, res ) => {
    // image_url: URL of a publicly accessible image
    const image_url = req.query.image_url;
    // 1. validate the image_url query
    if (image_url == null) {
      res.status(404).send("image_url is not specified");
    }
    // 2. call filterImageFromURL(image_url) to filter the image
    const filteredpath = await filterImageFromURL(image_url);
    console.log(filteredpath)
    // 3. send the resulting file in the response
    res.status(200).sendFile(filteredpath, function(err) {
      if (err) {
        res.status(502).send("Something is wrong with sending file");
      } else {
        // 4. deletes any files on the server on finish of the response
        deleteLocalFiles([filteredpath]);
      }
    });
  } );


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();