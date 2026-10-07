# ServiceNow PDI Playwright

Simple TypeScript + Playwright automation for opening ServiceNow PDI pages sequentially.

## Requirements

- Node.js 20+
- npm
- Linux server or Raspberry Pi
- ServiceNow PDI

## Install

Clone the repository:

```bash
git clone https://github.com/davve5/pdi-anti-reclaimer.git
cd pdi-anti-reclaimer
```

Install dependencies:

```bash
npm ci
```

Install Playwright:

```bash
npx playwright install chromium
npx playwright install-deps chromium
```

## Configuration

Create a `.env` file:

```env
PDI_URL=https://your-instance.service-now.com
PDI_USERNAME=admin
PDI_PASSWORD=your_password
PAGE_WAIT_MS=5000
```

Protect the file:

```bash
chmod 600 .env
```

**Never commit `.env` to GitHub.**

Make sure `.gitignore` contains:

```gitignore
.env
node_modules/
logs/
```

## Run manually

```bash
npm start
```

The script logs in and opens the configured pages one by one.

## Run with Cron

Find your project path:

```bash
pwd
```

For example:

```text
/home/pi/pdi-activity
```

Edit your cron:

```bash
crontab -e
```

Run every Sunday at 09:00:

```cron
0 9 * * 0 cd /home/pi/pdi-activity && /usr/bin/npm start >> /home/pi/pdi-activity/cron.log 2>&1
```

Check the cron configuration:

```bash
crontab -l
```

Check the logs:

```bash
tail -f /home/pi/pdi-activity/cron.log
```

## Pages

The default pages are:

```text
incident_list.do
problem_list.do
change_request_list.do
sc_req_item_list.do
```

They are opened **one at a time** and closed before the next page is opened.

You can change the pages in the TypeScript source.

## Security

Do not commit your ServiceNow username or password.

Use a `.env` file locally and keep it in `.gitignore`.

Only use this project with ServiceNow instances you are authorized to access.

## License

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files, to deal in the Software
without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.