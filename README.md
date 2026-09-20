# Arthikan Vettivel — Portfolio

A static personal portfolio focused on marketing, design, web development, software engineering, and the FYP podcast brand.

## Run locally on macOS

1. Open Terminal.
2. Go to this project folder:
   `cd /path/to/Arthikan-Portfolio`
3. Start a local server:
   `python3 -m http.server 8000`
4. Open `http://localhost:8000` in your browser.
5. Press Control + C in Terminal to stop the server.

## Publish with GitHub and Vercel

1. Create an empty GitHub repository.
2. Run these commands inside this project folder:
   `git init`
   `git add .`
   `git commit -m "Publish portfolio"`
   `git branch -M main`
   `git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git`
   `git push -u origin main`
3. In Vercel, import the GitHub repository.
4. Choose Framework Preset: Other.
5. Leave Build Command and Output Directory empty.
6. Deploy.

## Future updates

After editing files:

`git add .`
`git commit -m "Update portfolio"`
`git push origin main`

Vercel will deploy the new version automatically.
