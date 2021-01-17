# Helpr

In VSCode: Press F5 to run a debug version of the extension

Open Command Palette (Ctrl+Shift+P)

# Search for commands

3 commands have been implemented so far

### Hello World

displays a hello world prompt

### Start Helpr Server

starts to listen for incoming traffic to local machine, port **6969**
don't worry, server is automatically stopped when VSCode closes

### Stop Helpr Server

stops the server

# when you send a request to port 6969

For now, sending a request to [local ip]:6969 defaults to sending a `git pull` command in whatever folder is open in VSCode.
Will be able to configure this behavior via the HTTP request body that is sent. check the typing
Reference: [src/types/format.ts]()
