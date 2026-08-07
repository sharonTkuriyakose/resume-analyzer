const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'client', 'src');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace hex colors
    content = content.replace(/#06b6d4/gi, '#10b981'); // Cyan-500 to Emerald-500
    content = content.replace(/#0284c7/gi, '#059669'); // Sky-600 to Emerald-600
    content = content.replace(/#0369a1/gi, '#047857'); // Sky-700 to Emerald-700
    content = content.replace(/#38bdf8/gi, '#34d399'); // Sky-400 to Emerald-400

    // Replace rgb/rgba values
    // 6,182,212 is #06b6d4 -> replace with 16,185,129
    content = content.replace(/6,\s*182,\s*212/g, '16,185,129');
    
    // Replace gradient names if any
    content = content.replace(/blueGradient/g, 'greenGradient');

    // Replace cyan- and sky- tailwind classes
    content = content.replace(/cyan-/g, 'emerald-');
    content = content.replace(/sky-/g, 'green-');

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
