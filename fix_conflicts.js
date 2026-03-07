const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('<<<<<<< HEAD')) return;

    const regex = /<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n[\s\S]*?>>>>>>>[^\n]*\r?\n/g;

    const newContent = content.replace(regex, '$1');
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Fixed ${filePath}`);
}

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'dist' || file.includes('package-lock')) continue;
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverse(fullPath);
        } else {
            if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.json')) {
                processFile(fullPath);
            }
        }
    }
}

traverse('c:\\Users\\NAKULAN\\Downloads\\FSD-Project-1-master\\FSD-Project-1-master');
