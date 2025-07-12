export class SyntaxHighlighter {
    constructor(textareaId, highlightId) {
        this.textarea = document.getElementById(textareaId);
        this.highlight = document.getElementById(highlightId);
        this.codeElement = this.highlight.querySelector('code');
        this.currentLanguage = 'markup'; // Default to HTML/markup
        
        this.init();
    }
    
    init() {
        if (!this.textarea || !this.highlight) {
            console.warn('Textarea or highlight element not found');
            return;
        }
        
        // Sync scroll between textarea and highlight
        this.textarea.addEventListener('scroll', () => {
            this.highlight.scrollTop = this.textarea.scrollTop;
            this.highlight.scrollLeft = this.textarea.scrollLeft;
        });
        
        // Update highlighting on input
        this.textarea.addEventListener('input', () => {
            this.updateHighlight();
            this.detectLanguage();
        });
        
        // Initial setup
        this.setLanguage(this.currentLanguage);
        this.updateHighlight();
    }
    
    updateHighlight() {
        const code = this.textarea.value;
        this.codeElement.textContent = code;
        
        // Apply Prism highlighting
        if (window.Prism) {
            Prism.highlightElement(this.codeElement);
        }
    }
    
    setLanguage(language) {
        this.currentLanguage = language;
        this.highlight.className = `language-${language}`;
        this.codeElement.className = `language-${language}`;
        this.updateHighlight();
    }
    
    detectLanguage() {
        const code = this.textarea.value.trim();
        
        if (!code) return;
        
        // HTML/XML detection
        if (code.includes('<') && code.includes('>') && code.match(/<\/?[a-zA-Z][^>]*>/)) {
            if (this.currentLanguage !== 'markup') {
                this.setLanguage('markup');
            }
        }
        // CSS detection
        else if (code.includes('{') && code.includes(':') && code.includes(';')) {
            if (this.currentLanguage !== 'css') {
                this.setLanguage('css');
            }
        }
        // JavaScript detection
        else if (code.includes('function') || code.includes('const') || code.includes('let') || code.includes('var')) {
            if (this.currentLanguage !== 'javascript') {
                this.setLanguage('javascript');
            }
        }
    }
    
    // Get supported languages
    getSupportedLanguages() {
        return ['markup', 'html', 'xml', 'css', 'javascript', 'json', 'typescript'];
    }
}