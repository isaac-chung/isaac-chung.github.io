---
slug: quantized-models-dont-fit
title: When Quantized Models Still Don't Fit
authors: [ichung]
tags: [quantization, mixed, AI, LLM, ML, chatbot, mixtral]
image: ./big-apples.jpg
---

import Figure from '@site/src/components/figure';
import bigApples from './big-apples.jpg';


A key ingredient to running LLMs locally (read: without high-end GPUs, as in multiple) is quantization. What do you do when the 4-bit quantized model is still too big for your machine? That's what happened to me when I was trying to run [Mixtral-8x7B with Ollama](https://ollama.ai/library/mixtral) (check out this [previous blog post on what Ollama is](/blog/what-is-ollama)). The model requires 26GB of RAM while my laptop only has 16GB. I'll try to walk through the workaround a _bit_ at a time (pun intended).

:::tip[Key questions I'll address are:]

- What is quantization?
- What is offloading?
- How to run Mixtral-8x7B for free?

:::

<!-- truncate -->

## What is quantization?
Quantization generally is a process that converts continuous values to a discrete set of values. A tangible analogy would be how we tell time: time is continuous, and we use hours, minutes, and seconds to "quantize" time. Sometimes "around 10am" is good enough, and sometimes we want to be precise to the millisecond. 
In the context of deep learning, it is a technique to reduce the computational and memory costs of running a model by using lower-precision numerical types to repesent its weights and activations. In simpler terms, we are trying to be less precise with the numbers that makes up the model weights so that it takes up less memory and can perform operations faster. [This StackOverflow blog](https://stackoverflow.blog/2023/08/23/fitting-ai-models-in-your-pocket-with-quantization/) has great visualizations of how quantization works. Without repeating the main content, the key takeaway for me was this image: The fewer bits you use per pixel, the less memory needed, but the image quality also may decrease.
<Figure
  image="https://cdn.stackoverflow.co/images/jo7n4k8s/production/5ee6f4e98bf05001b3699344f784adad0177ebe0-688x444.gif?auto=format"
  alt="Representing images with varying number of bits."
  caption="Image from StackOverflow."
/>

Weights normally use 32-bit floating points, and are often quantized to float16 or [int8](https://github.com/TimDettmers/bitsandbytes). Ollama uses 4-bit quantization, which means instead of using 32 "101100..."s for one value, only 4 are used. That means theoretically, you get 8x savings in memory usage. Quantization can be broadly grouped into 2 main methods: 
1. Post Training Quantization (PTQ): Done after a model is trained. A "calibration dataset" is used to capture the distribution of activations to calculate quant parameters (scale, zero point) for all inputs. No re-training is needed.
2. Quantization Aware Training (QAT): Models are quantized during re-training/finetuning where low precision behaviour is simulated in the forward pass (backward pass remains the same). QAT is often able to better preserve accuracy when compared to PTQ, but incurs a high cost from re-training, which may not be suitable for LLMs.


When it comes to quantizing LLM weights, methods like [NF4](https://arxiv.org/abs/2305.14314), [GPTQ](https://arxiv.org/abs/2210.17323), [AWQ](https://arxiv.org/abs/2306.00978), and [GGML/GGUF](https://github.com/rustformers/llm/blob/main/crates/ggml/README.md) are among the most popular. Key observation is that not all weights are equally important (as pointed out in the AWQ paper). Keeping higher precision for more critical layers / weights proved to be key in the balance of accuracy and resource usage. In particular, the Mixtral model from Ollama seems to be using GGML, which groups blocks of values and rounds them to a lower precision (as opposed to using a global parameter). 

[A recent paper](https://arxiv.org/pdf/2312.17238.pdf) (3 weeks old!) that focuses on running Mixture-of-Experts type models on consumer hardware seems to have the answer to my misfortunes. In addition to quantization, they use one more trick in the book - offloading.

## What is offloading?
Offloading is putting some parameters in a separate, cheaper memory, such as system RAM, and only load them "just-in-time" when they are needed for computation. It proves to be very suitable for inferencing and training LLMs with limited GPU memory. In the context of using Mixtral, the MoE architecture contain multiple “experts” (layers) and a “gating function” that selects which experts are used on a given input. That way the MoE block only uses a small portion of all “experts” for any single forward pass. Each expert is offloaded separately and only brought pack to GPU when needed. 

<Figure
  image={bigApples}
  alt="8 big apples barely fitting into a crate."
  caption="Image by OpenAI DALL-E 3."
/>

## How to run Mixtral-8x7B for free?
So here we are. This is by no means to run Mixtral for production use. Here is the [colab notebook](https://github.com/dvmazur/mixtral-offloading/blob/master/notebooks/demo.ipynb) by the authors of the paper mentioned above. Even though they were targeting the hardware specs of the Google free-tier instances, I might just be able to run Mixtral on my laptop after all.


## Further Reading
1. [Making LLMs even more accessible with bitsandbytes, 4-bit quantization and QLoRA](https://huggingface.co/blog/4bit-transformers-bitsandbytes)
2. [Quantize Llama models with GGUF and llama.cpp](https://towardsdatascience.com/quantize-llama-models-with-ggml-and-llama-cpp-3612dfbcc172)
3. [4-bit Quantization with GPTQ](https://towardsdatascience.com/4-bit-quantization-with-gptq-36b0f4f02c34)