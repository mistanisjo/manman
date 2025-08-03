# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/12660796-ec9d-4b7e-b779-d83f3844aef4

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/12660796-ec9d-4b7e-b779-d83f3844aef4) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- OpenAI API integration

## Environment Setup

1. Copy `.env.example` to `.env`
2. Add your OpenAI API key to the `.env` file:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

**Important Security Note**: This implementation exposes the OpenAI API key in the browser for development purposes. In production, you should:
- Use a backend proxy to handle OpenAI API calls
- Never expose API keys in client-side code
- Implement proper authentication and rate limiting

## Features

- **Real-time AI Chat**: Powered by OpenAI's GPT-4o-mini model
- **Streaming Responses**: Real-time message streaming for better UX
- **Conversation Memory**: Full conversation context maintained
- **Persistent Storage**: Chat history saved in localStorage
- **Multiple Chat Sessions**: Create and manage multiple conversations
- **System Instructions**: Customizable AI behavior and personality
- **Modern UI**: Glass morphism design with dark/light themes
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Comprehensive error handling and user feedback

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/12660796-ec9d-4b7e-b779-d83f3844aef4) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
