import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('haru-maze-cat.showCat', () => {
        const panel = vscode.window.createWebviewPanel(
            'catPanel',
            'Haru and Maze',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
            }
        );

        const videoPath = vscode.Uri.file(path.join(context.extensionPath, 'media', 'harumaze.mp4'));
        const videoSrc = panel.webview.asWebviewUri(videoPath);

        console.log('Video Path:', videoPath.fsPath);
        console.log('Video Src:', videoSrc.toString());

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
                    height: 100vh;
                    background-color: transparent;
                }
                .draggable {
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                    width: 200px;
                    height: auto;
                    cursor: move;
                    z-index: 1000;
                }
                .description {
                    position: absolute;
                    bottom: 10px;
                    left: 10px;
                    z-index: 1000;
                }
            </style>
        </head>
        <body>
            <video src="${videoSrc}" autoplay loop muted class="draggable"></video>
            <div class="description">
                <p>Haru and Maze are here to relieve stress from the gruesome coding!</p>
            </div>
            <script>
                (function() {
                    const video = document.querySelector('.draggable');
                    let isDragging = false;
                    let offsetX, offsetY;

                    video.addEventListener('mousedown', (e) => {
                        isDragging = true;
                        offsetX = e.clientX - video.getBoundingClientRect().left;
                        offsetY = e.clientY - video.getBoundingClientRect().top;
                    });

                    document.addEventListener('mousemove', (e) => {
                        if (isDragging) {
                            video.style.left = e.clientX - offsetX + 'px';
                            video.style.top = e.clientY - offsetY + 'px';
                        }
                    });

                    document.addEventListener('mouseup', () => {
                        isDragging = false;
                    });
                })();
            </script>
        </body>
        </html>
    `;
}
