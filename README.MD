# Reasoner

A TypeScript-based project that uses reason tokens to enhance AI model outputs by incorporating reasoning capabilities.

## Description

Reasoner is a tool that integrates with various AI models to improve their response quality by adding a reasoning layer. It supports both direct model interactions and reasoned responses, allowing for comparison between standard and reasoning-enhanced outputs.

## Features

- Integration with multiple AI models through Siliconflow
- Support for both Visual Language Models (VLM) and Language Models (LLM)
- Streaming response support
- Colored console output for better visualization
- Environment variable configuration
- TypeScript support with full type definitions

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TypeScript

## Installation

1. Clone the repository:

git clone https://github.com/eric8810/reasoner.git

cd reasoner

3. Create a `.env` file in the root directory and add your API keys:

DEEPSEEK_API_KEY=your_deepseek_api_key
SILICONFLOW_API_KEY=your_siliconflow_api_key
SILICONFLOW_BASE_URL=your_siliconflow_base_url

## Usage

### Development

Run the project in development mode with hot reloading:

```bash
npm run dev
```

### Production

Run the compiled code:

```bash
npm start
```

### Running with Reasoning

To enable the reasoning feature, add the `--reason` flag:

```bash
npm start -- --reason
```

## Project Structure

- `src/`: Source code directory
  - `index.ts`: Main application entry point
  - `reasoner.client.ts`: Reasoning client implementation
  - `actioner.client.ts`: Action client implementation
  - `llm.provider.ts`: LLM provider configurations
  - `tools.doc.ts`: API documentation and tools
  - `cases.ts`: Test cases and examples

## Configuration

The project uses TypeScript with strict mode enabled and includes comprehensive compiler options. See `tsconfig.json` for detailed configuration.

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support, please open an issue in the GitHub repository.

## Acknowledgments

- OpenAI for the base client implementation
- Siliconflow for providing the AI model infrastructure
- DeepSeek for the reasoning capabilities
