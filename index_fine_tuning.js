import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

/* Upload training data */
// const upload = await openai.files.create({
//   file: await fetch('./motivational_bot_data.jsonl'),
//   purpose: 'fine-tune',
// });
// console.log(upload);

// "id": "file-62qjRaMspTZjaDmqgmkL46BL",

/* Use file ID to create job */

// const fineTune = await openai.fineTuning.jobs.create({
//     training_file: 'file-62qjRaMspTZjaDmqgmkL46BL',
//     model: 'gpt-3.5-turbo',
// });

// console.log(fineTune);

// {
//     "object": "fine_tuning.job",
//     "id": "ftjob-w4HMallhCOYPLlmTWaavR2U1",
//     "model": "gpt-3.5-turbo-0125",
//     "created_at": 1719677879,
//     "finished_at": null,
//     "fine_tuned_model": null,
//     "organization_id": "org-1j3ZccKCmYTTW6iawAIjrcXj",
//     "result_files": [],
//     "status": "validating_files",
//     "validation_file": null,
//     "training_file": "file-62qjRaMspTZjaDmqgmkL46BL",
//     "hyperparameters": {
//         "n_epochs": "auto",
//         "batch_size": "auto",
//         "learning_rate_multiplier": "auto"
//     },
//     "trained_tokens": null,
//     "error": {},
//     "user_provided_suffix": null,
//     "seed": 1710557055,
//     "estimated_finish": null,
//     "integrations": []
// }

/* Check status of job */

const fineTuneStatus = await openai.fineTuning.jobs.retrieve(
  'ftjob-w4HMallhCOYPLlmTWaavR2U1'
);

// console.log(fineTuneStatus);

// {
//     "object": "fine_tuning.job",
//     "id": "ftjob-w4HMallhCOYPLlmTWaavR2U1",
//     "model": "gpt-3.5-turbo-0125",
//     "created_at": 1719677879,
//     "finished_at": 1719678276,
//     "fine_tuned_model": "ft:gpt-3.5-turbo-0125:personal::9fVAMcmh",
//     "organization_id": "org-1j3ZccKCmYTTW6iawAIjrcXj",
//     "result_files": [
//         "file-2jnm5hli0lZMcFN598SQHJq5"
//     ],
//     "status": "succeeded",
//     "validation_file": null,
//     "training_file": "file-62qjRaMspTZjaDmqgmkL46BL",
//     "hyperparameters": {
//         "n_epochs": 3,
//         "batch_size": 1,
//         "learning_rate_multiplier": 2
//     },
//     "trained_tokens": 13017,
//     "error": {},
//     "user_provided_suffix": null,
//     "seed": 1710557055,
//     "estimated_finish": null,
//     "integrations": []
// }

/* Test our fine-tuned model */

const messages = [
  {
    role: 'user',
    content: "I don't know what to do with my life",
  },
];
async function getResponse() {
  const response = await openai.chat.completions.create({
    model: 'ft:gpt-3.5-turbo-0125:personal::9fVAMcmh',
    messages: messages,
  });
  return response.choices[0].message.content;
}
console.log(await getResponse());
