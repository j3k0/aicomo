# Aicomo

The AI Content Moderator.

## Description

Aicomo is a micro service used to classify chat message that might need moderation.

Under the hood, it uses the Mistral 7B LLM, with custom instructions, run with ollama and interfaced.

## Getting started

1. Install ollama.
2. Create the model: `ollama create -f Modelfile aicomo`
3. Install node dependencies: `npm install`
4. Run the server with `node index.js`

Make your first request:

```sh
$ curl -s -H 'Content-Type: application/json' localhost:3300/moderator -d '{"message": "You are Aicomo, arent you?"}'
```

```json
{
  "category": "ok",
  "discussion": {
    "moderator.text": "This message does not contain any explicit sexual content, insults, or emojis and seems to be a question, so I would classify it as 'ok'.",
    "moderator.category": "ok",
    "critic.text": "The message may be a statement of accusation or recognition, but it doesn't contain any inappropriate content, so there is no need to flag it under a different category.",
    "critic.category": "ok",
    "owner.text": "This text appears harmless and does not require moderation as it does not fall under any of the defined categories.",
    "owner.category": "ok"
  }
}
```

## Categories

Check `Modelfile` for a definition of the categories returned by Aicomo.
