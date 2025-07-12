export class KeyboardShortcuts {
    constructor(editor, syntaxHighlighter, editorFeatures) {
        this.editor = editor;
        this.syntaxHighlighter = syntaxHighlighter;
        this.editorFeatures = editorFeatures;
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });
    }

    handleKeydown(e) {
        const { key, ctrlKey, altKey, shiftKey } = e;

        // Ctrl+S - Save/Download
        if (ctrlKey && key === 's') {
            e.preventDefault();
            this.triggerDownload();
        }
        
        // Ctrl+Shift+F - Format Document
        else if (ctrlKey && shiftKey && key === 'F') {
            e.preventDefault();
            this.editorFeatures.formatDocument();
        }
        
        // Ctrl+A - Select All
        else if (ctrlKey && key === 'a') {
            // Let the default behavior happen for textarea
        }
        
        // Ctrl+Z - Undo (browser default)
        else if (ctrlKey && key === 'z') {
            // Let browser handle undo
        }
        
        // Ctrl+Y - Redo (browser default)
        else if (ctrlKey && key === 'y') {
            // Let browser handle redo
        }
        
        // Ctrl+/ - Toggle Comment
        else if (ctrlKey && key === '/') {
            e.preventDefault();
            this.toggleComment();
        }
        
        // Ctrl+D - Duplicate Line
        else if (ctrlKey && key === 'd') {
            e.preventDefault();
            this.duplicateLine();
        }
        
        // Alt+Up/Down - Move Line
        else if (altKey && (key === 'ArrowUp' || key === 'ArrowDown')) {
            e.preventDefault();
            this.moveLine(key === 'ArrowUp' ? -1 : 1);
        }
        
        // Ctrl+L - Select Line
        else if (ctrlKey && key === 'l') {
            e.preventDefault();
            this.selectLine();
        }
        
        // F11 - Toggle Fullscreen
        else if (key === 'F11') {
            e.preventDefault();
            this.toggleFullscreen();
        }
    }

    triggerDownload() {
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.click();
        }
    }

    toggleComment() {
        const textarea = this.editor;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        
        // Get the current line(s)
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = value.indexOf('\n', end);
        const endPos = lineEnd === -1 ? value.length : lineEnd;
        
        const selectedText = value.substring(lineStart, endPos);
        const lines = selectedText.split('\n');
        
        // Check if all lines are commented
        const allCommented = lines.every(line => line.trim().startsWith('//') || line.trim() === '');
        
        let newLines;
        if (allCommented) {
            // Uncomment
            newLines = lines.map(line => {
                const trimmed = line.trim();
                if (trimmed.startsWith('//')) {
                    const indent = line.match(/^\s*/)[0];
                    return indent + trimmed.substring(2).trim();
                }
                return line;
            });
        } else {
            // Comment
            newLines = lines.map(line => {
                if (line.trim() === '') return line;
                const indent = line.match(/^\s*/)[0];
                return indent + '// ' + line.trim();
            });
        }
        
        const newText = value.substring(0, lineStart) + 
                       newLines.join('\n') + 
                       value.substring(endPos);
        
        textarea.value = newText;
        textarea.dispatchEvent(new Event('input'));
    }

    duplicateLine() {
        const textarea = this.editor;
        const start = textarea.selectionStart;
        const value = textarea.value;
        
        // Find current line
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = value.indexOf('\n', start);
        const endPos = lineEnd === -1 ? value.length : lineEnd;
        
        const currentLine = value.substring(lineStart, endPos);
        const newValue = value.substring(0, endPos) + '\n' + currentLine + value.substring(endPos);
        
        textarea.value = newValue;
        textarea.selectionStart = textarea.selectionEnd = start + currentLine.length + 1;
        textarea.dispatchEvent(new Event('input'));
    }

    moveLine(direction) {
        const textarea = this.editor;
        const start = textarea.selectionStart;
        const value = textarea.value;
        
        // Find current line boundaries
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = value.indexOf('\n', start);
        const endPos = lineEnd === -1 ? value.length : lineEnd;
        
        const currentLine = value.substring(lineStart, endPos);
        
        if (direction === -1) {
            // Move up
            const prevLineStart = value.lastIndexOf('\n', lineStart - 2) + 1;
            if (prevLineStart < lineStart) {
                const prevLine = value.substring(prevLineStart, lineStart - 1);
                const newValue = value.substring(0, prevLineStart) +
                               currentLine + '\n' +
                               prevLine +
                               value.substring(endPos);
                
                textarea.value = newValue;
                textarea.selectionStart = textarea.selectionEnd = start - prevLine.length - 1;
                textarea.dispatchEvent(new Event('input'));
            }
        } else {
            // Move down
            const nextLineEnd = value.indexOf('\n', endPos + 1);
            const nextEndPos = nextLineEnd === -1 ? value.length : nextLineEnd;
            
            if (nextEndPos > endPos) {
                const nextLine = value.substring(endPos + 1, nextEndPos);
                const newValue = value.substring(0, lineStart) +
                               nextLine + '\n' +
                               currentLine +
                               value.substring(nextEndPos);
                
                textarea.value = newValue;
                textarea.selectionStart = textarea.selectionEnd = start + nextLine.length + 1;
                textarea.dispatchEvent(new Event('input'));
            }
        }
    }

    selectLine() {
        const textarea = this.editor;
        const start = textarea.selectionStart;
        const value = textarea.value;
        
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = value.indexOf('\n', start);
        const endPos = lineEnd === -1 ? value.length : lineEnd;
        
        textarea.selectionStart = lineStart;
        textarea.selectionEnd = endPos;
    }

    toggleFullscreen() {
        const editorContainer = document.querySelector('.parent-editor');
        
        if (!document.fullscreenElement) {
            editorContainer.requestFullscreen().catch(err => {
                console.warn('Could not enter fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Get help text for shortcuts
    getShortcutsHelp() {
        return `
Keyboard Shortcuts:
- Ctrl+S: Save/Download file
- Ctrl+Shift+F: Format document
- Ctrl+/: Toggle comment
- Ctrl+D: Duplicate line
- Alt+↑/↓: Move line up/down
- Ctrl+L: Select line
- F11: Toggle fullscreen
- Ctrl+A: Select all
- Ctrl+Z: Undo
- Ctrl+Y: Redo
        `.trim();
    }
}
