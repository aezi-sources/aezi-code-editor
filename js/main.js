// Import Functions

import { lineCal, lineDecal, updateLineNumbers } from './editor/line-numbers.js';
import { SyntaxHighlighter } from './editor/syntax-highlighter.js';
import { TextEditor } from './editor/text-editor.js';
import { EditorToolbar } from './components/toolbar.js';
import { FileManager } from './components/file-manager.js';
import { StatusBar } from './components/status-bar.js';
import { KeyboardShortcuts } from './utils/keyboard-shortcuts.js';

// Initialize components
const highlighter = new SyntaxHighlighter('code-editor', 'code-highlight');
const textEditor = new TextEditor('code-editor');
const fileManager = new FileManager();

// Make components globally available before creating toolbar
window.editorComponents = {
    highlighter,
    textEditor,
    fileManager
};

// Create wrapper for the entire editor
const editorWrapper = document.createElement('div');
editorWrapper.className = 'editor-wrapper';

// Create toolbar container div
const toolbarContainer = document.createElement('div');
toolbarContainer.id = 'editor-toolbar-container';

// Get references to existing elements
const parentEditor = document.querySelector('.parent-editor');
const editorContainer = document.querySelector('.editor-container');

// Restructure the DOM
editorWrapper.appendChild(toolbarContainer);
editorWrapper.appendChild(editorContainer);
parentEditor.appendChild(editorWrapper);

// Initialize toolbar (now that editorComponents is available)
const toolbar = new EditorToolbar('editor-toolbar-container', highlighter, textEditor);

// Connect file manager to toolbar
toolbar.setFileManager(fileManager);

// Initialize status bar (after wrapper is created)
const statusBar = new StatusBar('status-bar');

// Add all components to global object
window.editorComponents.statusBar = statusBar;
window.editorComponents.toolbar = toolbar;

// Initialize keyboard shortcuts
const keyboardShortcuts = new KeyboardShortcuts(
    document.getElementById('code-editor'),
    highlighter,
    textEditor
);

window.editorComponents.keyboardShortcuts = keyboardShortcuts;

// Checker for line numbers
let previousLineCount = 1;

const editor = document.querySelector('#code-editor');

if (editor) {
    editor.addEventListener('input', () => {
        const content = editor.value || '';
        const currentLineCount = Math.max(1, content.split('\n').length);

        const difference = currentLineCount - previousLineCount;

        if (difference > 0) {
            for (let i = 0; i < difference; i++) {
                lineCal();
            }
        } else if (difference < 0) {
            for (let i = 0; i < Math.abs(difference); i++) {
                lineDecal();
            }
        }

        previousLineCount = currentLineCount;
    });
    
    // Initialize line numbers properly
    updateLineNumbers();
    
    // Focus the editor on load
    editor.focus();

    // Add welcome message
    if (!editor.value) {
        editor.placeholder = "Start typing or drag & drop a file here...\n\nKeyboard shortcuts:\n• Ctrl+S: Save/Download\n• Ctrl+Shift+F: Format\n• Ctrl+/: Toggle comment\n• F11: Fullscreen";
    }
} else {
    console.warn('Code Editor not found');
}

// Scroll Event

const textarea = document.querySelector('#code-editor');
const lineNumbers = document.querySelector('#line-numbers-container');

textarea.addEventListener('scroll', () => {
  lineNumbers.scrollTop = textarea.scrollTop;
});

// Switching Themes

