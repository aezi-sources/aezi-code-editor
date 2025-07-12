export class FileUtils {
    static getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }

    static getLanguageFromExtension(extension) {
        const languageMap = {
            'html': 'markup',
            'htm': 'markup',
            'xml': 'markup',
            'css': 'css',
            'js': 'javascript',
            'javascript': 'javascript',
            'ts': 'typescript',
            'typescript': 'typescript',
            'json': 'json',
            'txt': 'text'
        };
        
        return languageMap[extension.toLowerCase()] || 'text';
    }

    static downloadFile(content, filename, mimeType = 'text/plain') {
        if (window.saveAs) {
            const blob = new Blob([content], { type: mimeType + ';charset=utf-8' });
            saveAs(blob, filename);
        } else {
            // Fallback download method
            const element = document.createElement('a');
            element.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(content));
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    }

    static readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    static validateFileType(file, allowedTypes = []) {
        if (allowedTypes.length === 0) return true;
        
        const extension = this.getFileExtension(file.name);
        return allowedTypes.includes(extension.toLowerCase());
    }

    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
