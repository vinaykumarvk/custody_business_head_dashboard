run = ["bash", "workflow.sh"]
hidden = ["node_modules", ".config"]
onBoot = []
deploymentTarget = "cloudrun"

[env]
PATH = "/home/runner/$REPL_SLUG/.config/npm/node_global/bin:/home/runner/$REPL_SLUG/node_modules/.bin"
npm_config_prefix = "/home/runner/$REPL_SLUG/.config/npm/node_global"

[nix]
channel = "stable-22_11"

[packager]
language = "nodejs"

[packager.features]
packageSearch = true
guessImports = true
enabledForHosting = false

[unitTest]
language = "nodejs"

[languages.javascript]
pattern = "**/{*.js,*.jsx,*.ts,*.tsx}"

[languages.javascript.languageServer]
start = ["typescript-language-server", "--stdio"]

[languages.typescript]
pattern = "**/{*.ts,*.tsx}"

[languages.typescript.languageServer]
start = ["typescript-language-server", "--stdio"]

[debugger]
support = true

[debugger.interactive]
transport = "localhost:0"
startCommand = ["dap-node"]

[debugger.interactive.initializeMessage]
command = "initialize"
type = "request"

[debugger.interactive.initializeMessage.arguments]
clientID = "replit"
clientName = "replit.com"
columnsStartAt1 = true
linesStartAt1 = true
locale = "en-us"
pathFormat = "path"
supportsInvalidatedEvent = true
supportsProgressReporting = true
supportsRunInTerminalRequest = true
supportsVariablePaging = true
supportsVariableType = true

[debugger.interactive.launchMessage]
command = "launch"
type = "request"

[debugger.interactive.launchMessage.arguments]
console = "externalTerminal"
cwd = "."
pauseForSourceMap = false
program = "./index.js"
request = "launch"
sourceMaps = true
stopOnEntry = false
type = "pwa-node"

[auth]
pageEnabled = false
buttonEnabled = false