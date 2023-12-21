const express = require('express');
const axios = require('axios');
const bunyan = require('bunyan');
const app = express();
const port = 3300;

// Configure Bunyan logger
const logger = bunyan.createLogger({ name: 'moderator' });

app.use(express.json());

app.post('/moderator', async (req, res) => {
  try {
    const message = req.body.message;
    const options = {
      url: 'http://127.0.0.1:11434/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        model: 'moderator',
        stream: false,
        prompt: message,
      },
    };

    let resultParsed = await makeRequest(options);

    if (!resultParsed || !resultParsed["owner.category"]) {
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        resultParsed = await makeRequest(options);

        if (!resultParsed || !resultParsed["owner.category"]) {
          // Retry the request
          retryCount++;
          continue;
        }

        respond(req, res, resultParsed);

        // Log successful request
        logger.info(`Request processed successfully: ${message}`);
        return;
      }

      // Retry limit reached, handle the failure
      res.status(500).end();
    }

    respond(req, res, resultParsed);

    // Log successful request
    logger.info(`Request processed successfully: ${message}`);
  } catch (error) {
    console.error(error);
    res.status(400).end();

    // Log error
    logger.error(`Error processing request: ${error}`);
  }
});

app.use((req, res) => {
  res.status(404).end();

  // Log 404 error
  logger.warn(`404 - Not Found: ${req.url}`);
});

app.listen(port, () => {
  // Log server start
  logger.info(`Server is running on port ${port}`);
});

async function makeRequest(options) {
  const response = await axios(options);
  const result = response.data.response;
  let resultParsed = null;

  try {
    resultParsed = JSON.parse(result);
  } catch {
  }

  return resultParsed;
} 

function respond(req, res, resultParsed) {
  res.status(200).json({
    category: resultParsed["owner.category"],
    discussion: resultParsed,
  });
}