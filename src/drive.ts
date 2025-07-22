import { google } from 'googleapis';
import path from 'path';

export function getDriveClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve('creds/service-account.json'),
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
  });
  return google.drive({ version: 'v3', auth });
}
