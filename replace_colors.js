const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'client', 'src');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace hex colors
    content = content.replace(/#FF6A00/g, '#06b6d4');
    content = content.replace(/#FFA040/g, '#38bdf8');
    content = content.replace(/#E65C00/g, '#0284c7');
    content = content.replace(/#FF7A00/g, '#0369a1');
    content = content.replace(/#ff6a00/gi, '#06b6d4');

    // Replace rgb/rgba values
    // 255,106,0 is #FF6A00 -> replace with 6,182,212
    content = content.replace(/255,\s*106,\s*0/g, '6,182,212');
    
    // Replace gradient names if any
    content = content.replace(/orangeGradient/g, 'blueGradient');

    // Replace amber- and orange- tailwind classes
    content = content.replace(/amber-/g, 'cyan-');
    content = content.replace(/orange-/g, 'blue-');

    fs.writeFileSync(filePath, content, 'utf8');
}

function traverseDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            traverseDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.css') || fullPath.endsWith('.js')) {
            replaceInFile(fullPath);
        }
    });
}

traverseDirectory(directoryPath);
console.log("Color replacement complete.");
