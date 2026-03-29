const fs = require('fs');
const filepath = 'c:/Users/Jaydeep/OneDrive/Attachments/Desktop/main_project/ankitbhai-ka-travel-web-service/frontend/frontend/src/styles/login.css';
let lines = fs.readFileSync(filepath, 'utf8').split('\n');
const cleanLines = lines.slice(0, 133);
cleanLines.push('}');
fs.writeFileSync(filepath, cleanLines.join('\n') + `

body.dark-theme .login__form {
  background: var(--card-bg) !important;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

body.dark-theme .login__form input {
  background-color: #2b2b2b !important;
  border: 1px solid #444 !important;
  color: #fff !important;
}

body.dark-theme .login__form input::placeholder {
  color: #888 !important;
}

body.dark-theme .login__form input:focus {
  background-color: #333 !important;
  border-color: var(--secondary-color) !important;
}
`, 'utf8');
