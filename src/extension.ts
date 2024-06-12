import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('haru-maze-cat.showCat', () => {

        const panel = vscode.window.createWebviewPanel(
            'haruMazeCat',
            'Haru and Maze',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
            }
        );

        const videoPath = vscode.Uri.file(path.join(context.extensionPath, 'media', 'harumaze.mp4'));
        const videoSrc = panel.webview.asWebviewUri(videoPath);

        panel.webview.html = getWebviewContent(videoSrc);

      
        panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'resize':
                    
                    panel.reveal(vscode.ViewColumn.Two, true);
                    break;
            }
        });

        panel.webview.postMessage({ command: 'resize' });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

function getWebviewContent(videoSrc: vscode.Uri) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Haru and Maze</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                }
                video {
                    width: 150px;
                    height: auto;
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    z-index: 1000;
                    border: 2px solid black;
                    border-radius: 8px;
                }
            </style>
            <script>
                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.command === 'resize') {
                        // Resize the window to small dimensions
                        window.resizeTo(200, 200);
                    }
                });
            </script>
        </head>
        <body>
            <video src="${videoSrc}" autoplay loop muted></video>
        </body>
        </html>
    `;
}
