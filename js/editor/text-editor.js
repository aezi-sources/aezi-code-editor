export class TextEditor {
    constructor(textareaId) {
        this.textarea = document.getElementById(textareaId);
        this.init();
    }

    init() {
        if (!this.textarea) {
            console.warn('Textarea element not found');
            return;
        }

        // Add event listeners for various editor features
        this.textarea.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.textarea.addEventListener('input', (e) => this.handleInput(e));
    }

    handleKeyDown(e) {
        const { key, ctrlKey, shiftKey } = e;
        const cursorPos = this.textarea.selectionStart;
        const value = this.textarea.value;

        // Handle Enter key for auto-indentation
        if (key === 'Enter') {
            this.handleEnterKey(e, cursorPos, value);
        }
        
        // Handle Tab key for indentation
        else if (key === 'Tab') {
            this.handleTabKey(e, cursorPos);
        }
        
        // Handle bracket/quote auto-completion
        else if (this.shouldAutoComplete(key)) {
            this.handleAutoComplete(e, key, cursorPos, value);
        }
        
        // Handle backspace for smart deletion
        else if (key === 'Backspace') {
            this.handleBackspace(e, cursorPos, value);
        }
    }

    handleInput(e) {
        // Handle tag auto-completion after typing '<'
        const cursorPos = this.textarea.selectionStart;
        const value = this.textarea.value;
        const charBeforeCursor = value.charAt(cursorPos - 1);
        
        if (charBeforeCursor === '>') {
            this.handleTagCompletion(cursorPos, value);
        }
    }

    handleEnterKey(e, cursorPos, value) {
        e.preventDefault();
        
        const lineStart = value.lastIndexOf('\n', cursorPos - 1) + 1;
        const currentLine = value.substring(lineStart, cursorPos);
        const indent = this.getIndentation(currentLine);
        
        // Check if we're inside a tag or need extra indentation
        const needsExtraIndent = this.needsExtraIndentation(currentLine, value, cursorPos);
        const extraIndent = needsExtraIndent ? '  ' : '';
        
        const newText = value.substring(0, cursorPos) + 
                       '\n' + indent + extraIndent + 
                       value.substring(cursorPos);
        
        this.textarea.value = newText;
        this.textarea.selectionStart = this.textarea.selectionEnd = cursorPos + 1 + indent.length + extraIndent.length;
        
        // Trigger input event for syntax highlighting
        this.textarea.dispatchEvent(new Event('input'));
    }

    handleTabKey(e, cursorPos) {
        e.preventDefault();
        
        const value = this.textarea.value;
        const newText = value.substring(0, cursorPos) + '  ' + value.substring(cursorPos);
        
        this.textarea.value = newText;
        this.textarea.selectionStart = this.textarea.selectionEnd = cursorPos + 2;
        
        // Trigger input event for syntax highlighting
        this.textarea.dispatchEvent(new Event('input'));
    }

    shouldAutoComplete(key) {
        const autoCompleteChars = ['(', '[', '{', '"', "'", '<'];
        return autoCompleteChars.includes(key);
    }

    handleAutoComplete(e, key, cursorPos, value) {
        const pairs = {
            '(': ')',
            '[': ']',
            '{': '}',
            '"': '"',
            "'": "'",
            '<': '>'
        };

        const closingChar = pairs[key];
        
        // For quotes, check if we're closing an existing quote
        if ((key === '"' || key === "'") && value.charAt(cursorPos) === key) {
            e.preventDefault();
            this.textarea.selectionStart = this.textarea.selectionEnd = cursorPos + 1;
            return;
        }

        // Auto-complete the pair
        e.preventDefault();
        const newText = value.substring(0, cursorPos) + key + closingChar + value.substring(cursorPos);
        this.textarea.value = newText;
        this.textarea.selectionStart = this.textarea.selectionEnd = cursorPos + 1;
        
        // Trigger input event for syntax highlighting
        this.textarea.dispatchEvent(new Event('input'));
    }

    handleBackspace(e, cursorPos, value) {
        if (cursorPos === 0) return;
        
        const charBefore = value.charAt(cursorPos - 1);
        const charAfter = value.charAt(cursorPos);
        
        const pairs = {
            '(': ')',
            '[': ']',
            '{': '}',
            '"': '"',
            "'": "'",
            '<': '>'
        };

        // Smart deletion of pairs
        if (pairs[charBefore] === charAfter) {
            e.preventDefault();
            const newText = value.substring(0, cursorPos - 1) + value.substring(cursorPos + 1);
            this.textarea.value = newText;
            this.textarea.selectionStart = this.textarea.selectionEnd = cursorPos - 1;
            
            // Trigger input event for syntax highlighting
            this.textarea.dispatchEvent(new Event('input'));
        }
    }

    handleTagCompletion(cursorPos, value) {
        // Look for the opening tag
        const beforeCursor = value.substring(0, cursorPos);
        const tagMatch = beforeCursor.match(/<(\w+)(?:\s[^>]*)?>/g);
        
        if (tagMatch) {
            const lastTag = tagMatch[tagMatch.length - 1];
            const tagName = lastTag.match(/<(\w+)/)[1];
            
            // Check if it's a self-closing tag
            const selfClosingTags = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
            
            if (selfClosingTags.includes(tagName.toLowerCase())) {
                return; // Don't auto-complete self-closing tags
            }
            
            // Check if closing tag already exists
            const afterCursor = value.substring(cursorPos);
            const closingTagRegex = new RegExp(`</${tagName}>`, 'i');
            
            if (!closingTagRegex.test(afterCursor)) {
                // Insert closing tag
                const newText = value.substring(0, cursorPos) + `</${tagName}>` + value.substring(cursorPos);
                this.textarea.value = newText;
                this.textarea.selectionStart = this.textarea.selectionEnd = cursorPos;
                
                // Trigger input event for syntax highlighting
                this.textarea.dispatchEvent(new Event('input'));
            }
        }
    }

    getIndentation(line) {
        const match = line.match(/^(\s*)/);
        return match ? match[1] : '';
    }

    needsExtraIndentation(currentLine, value, cursorPos) {
        // Check if we're inside a tag that needs indentation
        const trimmedLine = currentLine.trim();
        
        // If line ends with an opening tag (not self-closing), add extra indent
        if (trimmedLine.match(/<\w+(?:\s[^>]*)?>\s*$/)) {
            return true;
        }
        
        // If we're inside brackets, braces, or parentheses
        if (trimmedLine.match(/[{([]\s*$/)) {
            return true;
        }
        
        return false;
    }

    // Format the entire document
    formatDocument() {
        const value = this.textarea.value;
        let formatted = this.formatCode(value);
        
        this.textarea.value = formatted;
        this.textarea.dispatchEvent(new Event('input'));
    }

    formatCode(code) {
        // Simple code formatter
        const lines = code.split('\n');
        let indentLevel = 0;
        const indentSize = 2;
        
        const formatted = lines.map(line => {
            const trimmed = line.trim();
            
            if (trimmed === '') return '';
            
            // Decrease indent for closing tags/brackets
            if (trimmed.match(/^<\/\w+>/) || trimmed.match(/^[}\])]/)) {
                indentLevel = Math.max(0, indentLevel - 1);
            }
            
            const formattedLine = ' '.repeat(indentLevel * indentSize) + trimmed;
            
            // Increase indent for opening tags/brackets
            if (trimmed.match(/<\w+(?:\s[^>]*)?>\s*$/) && !trimmed.match(/<\w+[^>]*\/>/)) {
                indentLevel++;
            } else if (trimmed.match(/[{([]\s*$/)) {
                indentLevel++;
            }
            
            return formattedLine;
        });
        
        return formatted.join('\n');
    }

    // Insert snippet at cursor position
    insertSnippet(snippet) {
        const cursorPos = this.textarea.selectionStart;
        const value = this.textarea.value;
        
        const newText = value.substring(0, cursorPos) + snippet + value.substring(cursorPos);
        this.textarea.value = newText;
        this.textarea.selectionStart = this.textarea.selectionEnd = cursorPos + snippet.length;
        
        this.textarea.dispatchEvent(new Event('input'));
    }
}
