export class FileManager {
    constructor() {
        this.init();
    }

    init() {
        this.createFileInput();
        this.attachEventListeners();
    }

    createFileInput() {
        // Create hidden file input for opening files
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'file-input';
        fileInput.style.display = 'none';
        fileInput.accept = '.html,.css,.js,.json,.txt,.ts,.xml';
        document.body.appendChild(fileInput);
    }

    attachEventListeners() {
        const fileInput = document.getElementById('file-input');
        
        fileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e);
        });

        // Add drag and drop functionality
        const editor = document.getElementById('code-editor');
        if (editor) {
            editor.addEventListener('dragover', (e) => {
                e.preventDefault();
                editor.classList.add('drag-over');
            });

            editor.addEventListener('dragleave', (e) => {
                e.preventDefault();
                editor.classList.remove('drag-over');
            });

            editor.addEventListener('drop', (e) => {
                e.preventDefault();
                editor.classList.remove('drag-over');
                this.handleFileDrop(e);
            });
        }
    }

    openFile() {
        const fileInput = document.getElementById('file-input');
        fileInput.click();
    }

    async handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            await this.loadFile(file);
        }
    }

    async handleFileDrop(event) {
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            await this.loadFile(files[0]);
        }
    }

    async loadFile(file) {
        try {
            const content = await this.readFileContent(file);
            const editor = document.getElementById('code-editor');
            
            if (editor) {
                editor.value = content;
                editor.dispatchEvent(new Event('input'));
                
                // Auto-detect language based on file extension
                const extension = file.name.split('.').pop().toLowerCase();
                this.setLanguageFromExtension(extension);
                
                // Update document title
                document.title = `${file.name} - Aezi's Code Editor`;
                
                // Update status bar if available
                if (window.editorComponents && window.editorComponents.statusBar) {
                    window.editorComponents.statusBar.updateFileInfo(file.name);
                }
                
                console.log(`Loaded file: ${file.name}`);
            }
        } catch (error) {
            console.error('Error loading file:', error);
            alert('Error loading file: ' + error.message);
        }
    }

    readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            
            reader.onerror = (e) => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsText(file);
        });
    }

    setLanguageFromExtension(extension) {
        const languageMap = {
            'html': 'markup',
            'htm': 'markup',
            'xml': 'markup',
            'css': 'css',
            'js': 'javascript',
            'ts': 'typescript',
            'json': 'json'
        };

        const language = languageMap[extension] || 'markup';
        
        // Update language selector if it exists
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = language;
            languageSelect.dispatchEvent(new Event('change'));
        }
    }

    createNewFile() {
        const editor = document.getElementById('code-editor');
        if (editor) {
            if (editor.value && !confirm('Create new file? Current content will be lost.')) {
                return;
            }
            
            editor.value = '';
            editor.dispatchEvent(new Event('input'));
            editor.focus();
            
            // Reset language to HTML
            const languageSelect = document.getElementById('language-select');
            if (languageSelect) {
                languageSelect.value = 'markup';
                languageSelect.dispatchEvent(new Event('change'));
            }
            
            // Reset document title
            document.title = 'Aezi\'s Code Editor';
        }
    }

    exportFile(content, filename, mimeType = 'text/plain') {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }
}
