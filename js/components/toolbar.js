export class EditorToolbar {
    constructor(containerId, syntaxHighlighter, textEditor) {
        this.container = document.getElementById(containerId);
        this.syntaxHighlighter = syntaxHighlighter;
        this.textEditor = textEditor;
        this.fileManager = null; // Will be set via setFileManager method
        this.init();
    }

    setFileManager(fileManager) {
        this.fileManager = fileManager;
    }

    init() {
        if (!this.container) {
            console.warn('Toolbar container not found');
            return;
        }

        this.createToolbar();
    }

    createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'editor-toolbar';
        toolbar.innerHTML = `
            <div class="toolbar-section">
                <label for="language-select">Language:</label>
                <select id="language-select" class="language-selector">
                    <option value="markup">HTML</option>
                    <option value="css">CSS</option>
                    <option value="javascript">JavaScript</option>
                    <option value="json">JSON</option>
                    <option value="typescript">TypeScript</option>
                </select>
            </div>
            
            <div class="toolbar-section">
                <button id="new-btn" class="toolbar-btn" title="New File">
                    <span>📄</span> New
                </button>
                
                <button id="open-btn" class="toolbar-btn" title="Open File">
                    <span>📁</span> Open
                </button>
                
                <button id="format-btn" class="toolbar-btn" title="Format Document">
                    <span>🎨</span> Format
                </button>
                
                <button id="download-btn" class="toolbar-btn" title="Download File">
                    <span>💾</span> Download
                </button>
                
                <button id="clear-btn" class="toolbar-btn" title="Clear Editor">
                    <span>🗑️</span> Clear
                </button>
            </div>
            
            <div class="toolbar-section">
                <button id="snippet-html" class="snippet-btn" title="Insert HTML5 Template">
                    HTML5
                </button>
                
                <button id="snippet-css" class="snippet-btn" title="Insert CSS Template">
                    CSS
                </button>
                
                <button id="snippet-js" class="snippet-btn" title="Insert JS Function">
                    JS Func
                </button>
            </div>
        `;

        // Append to the container (don't insert before anything)
        this.container.appendChild(toolbar);

        this.attachEventListeners();
    }

    attachEventListeners() {
        // Language selector
        const languageSelect = document.getElementById('language-select');
        languageSelect.addEventListener('change', (e) => {
            this.syntaxHighlighter.setLanguage(e.target.value);
        });

        // New file button
        const newBtn = document.getElementById('new-btn');
        newBtn.addEventListener('click', () => {
            if (this.fileManager) {
                this.fileManager.createNewFile();
            } else {
                console.warn('FileManager not available');
            }
        });

        // Open file button
        const openBtn = document.getElementById('open-btn');
        openBtn.addEventListener('click', () => {
            if (this.fileManager) {
                this.fileManager.openFile();
            } else {
                console.warn('FileManager not available');
            }
        });

        // Format button
        const formatBtn = document.getElementById('format-btn');
        formatBtn.addEventListener('click', () => {
            this.textEditor.formatDocument();
        });

        // Download button
        const downloadBtn = document.getElementById('download-btn');
        downloadBtn.addEventListener('click', () => {
            this.downloadFile();
        });

        // Clear button
        const clearBtn = document.getElementById('clear-btn');
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the editor?')) {
                this.clearEditor();
            }
        });

        // Snippet buttons
        document.getElementById('snippet-html').addEventListener('click', () => {
            this.insertSnippet('html5');
        });

        document.getElementById('snippet-css').addEventListener('click', () => {
            this.insertSnippet('css');
        });

        document.getElementById('snippet-js').addEventListener('click', () => {
            this.insertSnippet('jsFunction');
        });
    }

    downloadFile() {
        const content = this.textEditor.textarea.value;
        const language = document.getElementById('language-select').value;
        
        const extensions = {
            'markup': 'html',
            'css': 'css',
            'javascript': 'js',
            'json': 'json',
            'typescript': 'ts'
        };

        const extension = extensions[language] || 'txt';
        const filename = `code.${extension}`;
        
        if (window.saveAs) {
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, filename);
        } else {
            // Fallback download method
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    }

    clearEditor() {
        this.textEditor.textarea.value = '';
        this.textEditor.textarea.dispatchEvent(new Event('input'));
        this.textEditor.textarea.focus();
    }

    insertSnippet(type) {
        const snippets = {
            html5: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`,
            
            css: `/* CSS Styles */
body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}`,
            
            jsFunction: `function myFunction() {
    // Your code here
    console.log('Hello, World!');
}`
        };

        if (snippets[type]) {
            this.textEditor.insertSnippet(snippets[type]);
            
            // Auto-detect and set language based on snippet
            if (type === 'html5') {
                this.syntaxHighlighter.setLanguage('markup');
                document.getElementById('language-select').value = 'markup';
            } else if (type === 'css') {
                this.syntaxHighlighter.setLanguage('css');
                document.getElementById('language-select').value = 'css';
            } else if (type === 'jsFunction') {
                this.syntaxHighlighter.setLanguage('javascript');
                document.getElementById('language-select').value = 'javascript';
            }
        }
    }
}
