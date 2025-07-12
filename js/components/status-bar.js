export class StatusBar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.editor = document.getElementById('code-editor');
        this.init();
    }

    init() {
        if (!this.container) {
            this.createStatusBar();
        }
        
        this.attachEventListeners();
        this.updateStatus();
    }

    createStatusBar() {
        const statusBar = document.createElement('div');
        statusBar.className = 'status-bar';
        statusBar.id = 'status-bar';
        statusBar.innerHTML = `
            <div class="status-left">
                <span id="cursor-position">Ln 1, Col 1</span>
                <span id="selection-info"></span>
            </div>
            
            <div class="status-center">
                <span id="file-info">Untitled</span>
            </div>
            
            <div class="status-right">
                <span id="language-info">HTML</span>
                <span id="encoding-info">UTF-8</span>
                <span id="line-ending-info">LF</span>
                <span id="character-count">0 chars</span>
            </div>
        `;

        // Append to the editor wrapper
        const editorWrapper = document.querySelector('.editor-wrapper');
        if (editorWrapper) {
            editorWrapper.appendChild(statusBar);
        } else {
            // Fallback - insert after parent-editor
            const parentEditor = document.querySelector('.parent-editor');
            parentEditor.parentNode.insertBefore(statusBar, parentEditor.nextSibling);
        }
        
        this.container = statusBar;
    }

    attachEventListeners() {
        if (!this.editor) return;

        // Update on cursor movement
        this.editor.addEventListener('selectionchange', () => {
            this.updateCursorPosition();
        });

        // Update on input
        this.editor.addEventListener('input', () => {
            this.updateStatus();
        });

        // Update on click/keyup for cursor position
        this.editor.addEventListener('click', () => {
            this.updateCursorPosition();
        });

        this.editor.addEventListener('keyup', () => {
            this.updateCursorPosition();
        });

        // Listen for language changes
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.updateLanguageInfo(e.target.value);
            });
        }
    }

    updateStatus() {
        this.updateCursorPosition();
        this.updateCharacterCount();
        this.updateSelectionInfo();
    }

    updateCursorPosition() {
        if (!this.editor) return;

        const cursorPos = this.editor.selectionStart;
        const value = this.editor.value;
        
        // Calculate line and column
        const textBeforeCursor = value.substring(0, cursorPos);
        const lines = textBeforeCursor.split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;

        const positionElement = document.getElementById('cursor-position');
        if (positionElement) {
            positionElement.textContent = `Ln ${line}, Col ${column}`;
        }
    }

    updateCharacterCount() {
        if (!this.editor) return;

        const content = this.editor.value;
        const charCount = content.length;
        const lineCount = content ? content.split('\n').length : 1;
        const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

        const charElement = document.getElementById('character-count');
        if (charElement) {
            charElement.textContent = `${charCount} chars, ${wordCount} words, ${lineCount} lines`;
        }
    }

    updateSelectionInfo() {
        if (!this.editor) return;

        const start = this.editor.selectionStart;
        const end = this.editor.selectionEnd;
        const selectionLength = end - start;

        const selectionElement = document.getElementById('selection-info');
        if (selectionElement) {
            if (selectionLength > 0) {
                const selectedText = this.editor.value.substring(start, end);
                const selectedLines = selectedText.split('\n').length;
                selectionElement.textContent = `(${selectionLength} selected, ${selectedLines} lines)`;
                selectionElement.style.display = 'inline';
            } else {
                selectionElement.style.display = 'none';
            }
        }
    }

    updateLanguageInfo(language) {
        const languageElement = document.getElementById('language-info');
        if (languageElement) {
            const displayNames = {
                'markup': 'HTML',
                'css': 'CSS',
                'javascript': 'JavaScript',
                'json': 'JSON',
                'typescript': 'TypeScript'
            };
            
            languageElement.textContent = displayNames[language] || language.toUpperCase();
        }
    }

    updateFileInfo(filename = 'Untitled') {
        const fileElement = document.getElementById('file-info');
        if (fileElement) {
            fileElement.textContent = filename;
        }
    }

    showMessage(message, type = 'info', duration = 3000) {
        // Create temporary message element
        const messageElement = document.createElement('div');
        messageElement.className = `status-message status-${type}`;
        messageElement.textContent = message;
        
        this.container.appendChild(messageElement);
        
        // Remove after duration
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, duration);
    }

    setTheme(theme) {
        if (this.container) {
            this.container.setAttribute('data-theme', theme);
        }
    }
}
