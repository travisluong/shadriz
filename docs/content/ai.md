# shadrizz AI Docs

This is the documentation for the AI-assisted scaffolding and AI developer tools.

AI is a premium feature of shadrizz. You must obtain an API key by signing into the shadrizz app.

## Configure

See a list of config commands:

```bash
npx shadrizz@latest config
```

Set api key:

```bash
npx shadrizz@latest config set-api-key <key>
```

Get api key:

```bash
npx shadrizz@latest config get-api-key
```

The api key will be stored in `~/.shadrizz/config.json`.

## AI commands

See a list of ai commands.

```bash
npx shadrizz@latest ai -h
```

### 1. The AI scaffold tool

AI-assisted scaffolding wizard. Running this command will start an interactive prompt.

Simply describe your app and the AI will suggest a scaffold. You can make adjustments to the schema and run the scaffold when you are satisfied with the design.

```bash
npx shadrizz@latest ai scaffold
```

### 2. The AI scaffold adjustment tool

This tool is a continuation of the first tool and is run as part of the first command. It takes the generated scaffold and makes any adjustment as described by the user.

### 3. The color palette tool

This command will ask the user for the ideal color palette. The AI will then generate a color palette based on the user's description, and write the results to `globals.css` in the correct hsl format.

```bash
npx shadrizz@latest ai color-palette
```
