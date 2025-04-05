import OpenAI from "openai";
const openai = new OpenAI();

async function main() {
  const assistant = await openai.beta.assistants.create({
    name: "Task Assistant",
    instructions:
      "You are a personal task assistant. Suggest tasks and advice for the user",
    tools: [{ type: "code_interpreter" }],
    model: "gpt-4o",
  });
}

main();
