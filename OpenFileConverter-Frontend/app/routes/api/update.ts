import { exec } from 'child_process';
import path from 'path';
import { json } from '@remix-run/node';
import { ActionFunction } from '@remix-run/node';

const updateScriptPath = path.resolve(process.cwd(), 'docker-compose.yml');

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    return new Promise((resolve) => {
      exec(`cd ${path.dirname(updateScriptPath)} && ./upgrade-script.sh`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing script: ${error.message}`);
          resolve(json({ message: 'Update failed. Please try again.' }, { status: 500 }));
        } else if (stderr) {
          console.error(`Script stderr: ${stderr}`);
          resolve(json({ message: 'Update failed. Please try again.' }, { status: 500 }));
        } else {
          console.log(`Script stdout: ${stdout}`);
          resolve(json({ message: 'Update completed successfully.' }, { status: 200 }));
        }
      });
    });
  } else {
    return json({ message: `Method ${request.method} Not Allowed` }, { status: 405 });
  }
};