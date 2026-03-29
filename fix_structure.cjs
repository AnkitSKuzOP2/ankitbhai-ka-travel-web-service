const fs = require('fs');
const path = require('path');

const p = 'c:/Users/Jaydeep/OneDrive/Attachments/Desktop/main_project/ankitbhai-ka-travel-web-service/frontend/frontend/src';

function renameDir(oldName, newName) {
    const oldPath = path.join(p, oldName);
    const newPath = path.join(p, newName);
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed ${oldName} to ${newName}`);
    } else {
        console.log(`${oldName} does not exist`);
    }
}

renameDir('Component', 'components');
renameDir('Pages', 'pages');
renameDir('Shared', 'shared');
renameDir('assest', 'assets');
