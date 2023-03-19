import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const completion = await openai.createCompletion({
    //model: "text-davinci-002",//more expensive but more accurate
    model: "text-curie-001", //cheaper model
    prompt: generatePrompt(req.body.job),
    temperature: 0.78,
    max_tokens: 418,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  res.status(200).json({ result: completion.data.choices[0].text });
}

function generatePrompt(job) {
  const capitalizedJob = job[0].toUpperCase() + job.slice(1).toLowerCase();
  return `Create a list of 10  questions for my job interview as a ${capitalizedJob}`;
}
