import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('haru-maze-cat.showCat', () => {
        // Create and show a new webview
        const panel = vscode.window.createWebviewPanel(
            'haruMazeCat',
            'Haru and Maze',
            vscode.ViewColumn.Beside, // Open beside the current editor
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
            }
        );

        const videoPath = vscode.Uri.file(path.join(context.extensionPath, 'media', 'harumaze.mp4'));
        const videoSrc = panel.webview.asWebviewUri(videoPath);

        panel.webview.html = getWebviewContent(videoSrc);
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
                    background-color: transparent;
                }
                .video-container {
                    width: 150px;
                    height: auto;
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    z-index: 1000;
                    border: 2px solid black;
                    border-radius: 8px;
                    cursor: move;
                }
                video {
                    width: 100%;
                    height: auto;
                    border-radius: 8px;
                }
            </style>
        </head>
        <body>
            <div class="video-container" id="videoContainer">
                <video src="${videoSrc}" autoplay loop muted></video>
            </div>
            <script>
                const videoContainer = document.getElementById('videoContainer');

                videoContainer.addEventListener('mousedown', onMouseDown);

                function onMouseDown(event) {
                    event.preventDefault();
                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);

                    let shiftX = event.clientX - videoContainer.getBoundingClientRect().left;
                    let shiftY = event.clientY - videoContainer.getBoundingClientRect().top;

                    function onMouseMove(event) {
                        videoContainer.style.left = event.pageX - shiftX + 'px';
                        videoContainer.style.top = event.pageY - shiftY + 'px';
                    }

                    function onMouseUp() {
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);
                    }
                }

                videoContainer.ondragstart = () => false;
            </script>
        </body>
        </html>
    `;
}
