---
slug: what-is-ollama
title: What is Ollama? A shallow dive into running LLMs locally
authors: [ichung]
tags: [ollama, llama, chat, AI, LLM, ML, chatbot, local]
image: ./tiny-llama.png
---

import Figure from '@site/src/components/figure';
import tinyLlama from './tiny-llama.png';


Being able to run LLMs locally and _easily_ is truly a game changer. I have heard about [Ollama](https://github.com/jmorganca/ollama) before and decided to take a look at it this past weekend. 

:::tip[Key questions I'll address are:]

- Why is running LLMs locally becoming a hot thang
- What is Ollama?
- Should you use Ollama?

:::

<!-- truncate -->

## Why is running LLMs locally becoming a hot thang?
There was a time when LLMs were only accessible via cloud APIs from the giant providers like OpenAI and Anthropic. Don't get me wrong, those cloud API providers still dominate the market, and they have nice UIs that makes it easy for many users to get started. The price users pay (other than a pro plan or API costs) is that the providers will have full access to your chat data. For those who want run LLMs securely on their own hardware, they either had to train their own LLM (which is super costly), or wait till the release of Llama2 - an open weights model family. After that, a flood of how-to cookbooks and self-deployment launch services came onto the scene to help user deploy their own Llama2 "instance".

At this point, LLMs are still running on the cloud (just happens to be your own cloud), where management of the instances and GPUs could take up quite a lot of resources. It was necessary at the time because of the model sizes. The smallest Llama2 model (16bit floating point precision version of Llama2-7b-chat) comes in at 13GB. This means that most of the LLMs that are bigger that 7B (i.e. in the 10s or even 100s of GB in size) cannot fit into a regular laptop GPU. 

Then came the hail mary - quantization (to be covered in a separate blog later). By quantizing the model weights to 4-bits, the [Llama2-7b-chat model](https://ollama.ai/library/llama2:7b) now only takes up 3.8GB, which means, it'll finally fit!

<Figure
  image={tinyLlama}
  alt="A tiny llama alongside a regular sized llama"
  caption="Image by OpenAI DALL-E 3."
/>

## What is Ollama?
[Ollama](https://ollama.ai/) is an open-source app that lets you run, create, and share large language models locally with a command-line interface on MacOS and Linux. 
Given the name, Ollama began by supporting Llama2, then expanded its [model library](https://ollama.ai/library) to include models like Mistral and Phi-2. Ollama makes it easy to get started with running LLMs on your own hardware in very little setup time.

## Should you use Ollama?
Yes, if you want to be able to run LLMs on your laptop, keep your chat data away from 3rd party services, and can interact with them via command line in a simple way. There are also many community integrations such as UIs and plugins in chat platforms. It might not be for you if you do not want to deal with setting up at all.


## How to get started with Ollama
It seems super simple. 

1. On Mac, simply [download the application](https://ollama.ai/download/Ollama-darwin.zip). 
2. Then run this to start chatting with Llama2:
```
ollama run llama2
```

In addition to chatting with text prompts, Ollama also supports:
- [multimodal inputs](https://github.com/jmorganca/ollama?tab=readme-ov-file#multimodal-models): e.g. asking questions about an iamge
- [passing an argument within a prompt](https://github.com/jmorganca/ollama?tab=readme-ov-file#pass-in-prompt-as-arguments): e.g. summarize a README page
- [serving as a REST API](https://github.com/jmorganca/ollama?tab=readme-ov-file#rest-api): e.g. chat with the model using python scripts
- [running as a docker image](https://ollama.ai/blog/ollama-is-now-available-as-an-official-docker-image): e.g. Deploy Ollama with Kubernetes 

The [official Github repo README page](https://github.com/jmorganca/ollama) has more examples.

## Some notes
After using Ollama for a weekend, I have noticed the following that may not be obvious at first glance:
1. By hitting the `run` command, you start a chat session. This session will live until you exit from it or when you terminate process. Interestingly, chat state was not managed at the beginning, which means that you'd run into issues where [the model immediately forgets about the context right after a response](https://github.com/jmorganca/ollama/issues/8). Now, you can keep chatting and the model remembers what you entered as long as it fits within its context window. Once the context window is exceeded, Ollama will truncate the input from the beginngin until it fits the context window again [while keeping the system instructions](https://github.com/jmorganca/ollama/pull/306). 
2. Ollama is based on [llama.cpp](https://github.com/ggerganov/llama.cpp), an implementation of the Llama architecture in plain C/C++ without dependencies using only CPU and RAM. 
3. Ollama is quite docker-like, and for me it feels intuitive. You pull models then run them. The [Modelfile](https://github.com/jmorganca/ollama/blob/main/docs/modelfile.md), the "blueprint to create and share models with Ollama", is also quite dockerfile-like.

Overall I find Ollama quite easy to use and would likely continue to use it for something quick. It would be pretty fun if [conversation history can be persisted](https://github.com/jmorganca/ollama/issues/142)!
