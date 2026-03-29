const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Jaydeep/OneDrive/Attachments/Desktop/main_project/ankitbhai-ka-travel-web-service/frontend/frontend/src';

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach((name) => {
        const filePath = path.join(currentDirPath, name);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

const replacements = [
    { regex: /([\'\"][\.\/]+)Component\//g, replace: '$1components/' },
    { regex: /([\'\"][\.\/]+)Pages\//g, replace: '$1pages/' },
    { regex: /([\'\"][\.\/]+)Shared\//g, replace: '$1shared/' },
    { regex: /([\'\"][\.\/]+)assest\//g, replace: '$1assets/' },
    // A special case:
    { regex: /([\'\"][\.\/]*src\/)assest\//g, replace: '$1assets/' }
];

walkSync(dir, (filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.css')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;
        for (let r of replacements) {
            newContent = newContent.replace(r.regex, r.replace);
        }
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    }
});
