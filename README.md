
# Link Bookmark

Link Bookmark simply get the content from the website url provided and stores for you.




## Tech Stack

**Nextjs:** For web development

**Firebase:** For authentication and data storage


## Installation

Clone repository by 

```bash
  git clone git@github.com:KaustubhVaidya404/bookmarklink.git
```

change directory

```bash
cd bookmarklink
```

create .env.local file at root 

```bash
touch .env.local
```

enter your credentials

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

for development run

```bash
npm run dev 
```

## What I'd do next

- Implemented text-to-speech using gtts to read website content
- Improve UI 
- Sharable collection where user can create bookmark collections and user can share them with other (kindoff improved version of linktree)

## How long I spent time to build this

I haven't build this app in one go I have build in multiple chunks of time slots but approximately 4-5 hours