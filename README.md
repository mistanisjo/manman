# Welcome to your Lovable project

## AI Chat Assistant

A production-ready AI chat application powered by OpenAI's GPT models with advanced features including conversation memory, system instructions, and real-time streaming responses.

### Features

- **OpenAI Integration**: Full integration with OpenAI's API for intelligent responses
- **Conversation Memory**: Maintains context across messages with intelligent history management
- **System Instructions**: Customizable AI behavior through system prompts
- **Real-time Streaming**: Live response streaming for better user experience
- **Chat Management**: Create, delete, and organize multiple conversations
- **Export/Import**: Save and restore conversation history
- **Error Handling**: Robust error handling with user-friendly messages
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes with system preference support
- **Production Ready**: Built with TypeScript, proper error boundaries, and performance optimizations

### Setup Instructions

1. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   
2. **Add your OpenAI API Key**:
   Edit `.env` and add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

### Configuration Options

The application supports various configuration options through environment variables:

- `VITE_OPENAI_API_KEY`: Your OpenAI API key (required)
- `VITE_OPENAI_MODEL`: AI model to use (default: gpt-4o-mini)
- `VITE_OPENAI_MAX_TOKENS`: Maximum tokens per response (default: 2000)
- `VITE_OPENAI_TEMPERATURE`: Response creativity (default: 0.7)

### Production Deployment

For production deployment:

1. **Security**: Never expose your OpenAI API key in the frontend. Use a backend proxy instead.
2. **Rate Limiting**: Implement proper rate limiting to prevent API abuse.
3. **Monitoring**: Add logging and monitoring for API usage and errors.
4. **Caching**: Consider implementing response caching for common queries.

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

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/12660796-ec9d-4b7e-b779-d83f3844aef4) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
