# shadrizz AI Docs

This is the documentation for the AI-assisted scaffolding and AI developer tools.

AI is a premium feature of shadrizz. You must obtain an API key by signing into the shadrizz app.

## Configure

See a list of config commands:

```
npx shadrizz@latest config
```

Set api key:

```
npx shadrizz@latest config set-api-key <key>
```

Get api key:

```
npx shadrizz@latest config get-api-key
```

The api key will be stored in `~/.shadrizz/config.json`.

## AI commands

See a list of ai commands.

```
npx shadrizz@latest ai -h
```

### The AI scaffold command

AI-assisted scaffolding wizard. Running this command will start an interactive prompt.

Simply describe your app and the AI will suggest a scaffold. You can make adjustments to the schema and run the scaffold when you are satisfied with the design.

```
npx shadrizz@latest ai scaffold
```
