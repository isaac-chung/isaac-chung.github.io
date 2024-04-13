---
slug: concurrent-requests
title: Serving Concurrent Requests with Quantized LLMs 
authors: [ichung]
tags: [LLM, concurrent, requests, parallel, multi-user]
image: ./octopus.png
enableComments: true
---

import Figure from '@site/src/components/figure';
import octopus from './octopus.png';

Being able to serve concurrent LLM generation requests are crucial to production LLM applications that have multiple users. [I recently gave a talk at PyCon Lithuania](https://pycon.lt/2024/talks/DHBLXW) on serving quantized LLMs with [llama-cpp-python](https://github.com/abetlen/llama-cpp-python), an open source python library that helps serve quantized models in the GGUF format. At the end, a question came from the audience about supporting multiple users and concurrent requests. I decided to take a deeper look into why the library wasn't able to support that at the time.

:::tip[Key questions I'll address are:]

- What are the challenges of serving concurrent requests with LLMs?
- How to serve concurrent requests with quantized LLMs?

:::

<!-- truncate -->

<Figure
  image={octopus}
  alt="New yorker style comic depicting a cute, friendly cartoon octopus with a baseball cap holding multiple tennis rackets. White background only."
  caption="Image by Dalle3."
/>

## What are the challenges of serving concurrent requests with LLMs?
LLM inference involves generating tokens in an autoregressive manner. To avoid repeating calculations when generating future tokens, a KV cache is used. 
The KV cache size grows quickly with the number of requests. The [vLLM paper](https://arxiv.org/abs/2309.06180) uses the 13B OPT model as an example:
> the KV cache of a single token demands 800 KB of space, calculated as 2 (key and value vectors) × 5120 (hidden state size) × 40 (number of layers) × 2 (bytes per FP16). Since OPT can generate sequences up to 2048 tokens, the memory required to store the KV cache of one request can be as much as 1.6 GB

It's clear that this is a memory-bound process. In the context of serving requests, we can batch multiple incoming requests to improve compute utilization. Batching isn't trivial either. The main challenges includes:
1. The requests may arrive at different times, and
2. the requests may have very different input and output lengths.

Batching requests naively may lead to huge delays from waiting for earlier requests to finish before starting the next batch, or waiting for the longest generation to finish. It would also lead to computation and memory wastage from padding inputs/outputs due to their difference in lengths. 

Back to the question from the talk. At the time of writing, llama-cpp-python did not support batched requests. Moreover, concurrent requests would [lead to the server crashing](https://www.reddit.com/r/LocalLLaMA/comments/15kbbna/how_to_make_multiple_inference_requests_from_a/). This might be due to the locks being used to control access to shared resources, particularly the `llama_proxy` variable, which handles the model resources. This means that to serve parallel requests, multiple instances of the models may be needed, and this drastically increases the resources required for model serving. 

## How to serve concurrent requests with quantized LLMs?
Improvements have been introduced to make serving concurrent requests more efficient. These include and are not limited to:
1. **Continuous Batching**: It allows new requests to join the current batch in the next decoder cycle instead of waiting for the end of the current batch to finish. This improves throughput and compute utilization. The upstream [llama.cpp repo](https://github.com/ggerganov/llama.cpp/tree/master/examples/server) has the capability to serve parallel requests with continuous batching. This, however, does not entirely solve the memory issue. We still need to reserve memory using the longest sequence in the batch. 
2. **Paged Attention**: It divides up the KV cache into blocks that would contain keys and values for a fixed number of tokens. It eliminates external fragmentation (unusable gaps between allocated memory blocks in a GPU's memory) since all blocks have the same size. Also, it eases internal fragmentation by using relatively small blocks. An LLM serving engine that's built on top of Paged Attention is [vLLM](https://github.com/vllm-project/vllm). 

## What is vLLM?
vLLM is a high-throughput and memory-efficient inference and serving engine for LLMs. vLLM supports serving quantized LLMs with concurrent requests with AWQ (4-bit) models, which boasts a 2.78x speed up on a single GPU according to [a benchmark done by lightning.ai](https://lightning.ai/lightning-ai/studios/optimized-llm-inference-api-for-mistral-7b-using-vllm). 

## Final Thoughts
Tools like llama-cpp-python and ExLlama2 may not have been designed to be [an efficient backend for large deployments](https://github.com/turboderp/exllamav2/issues/95#issuecomment-2019991153), but they are certainly worth a look for anyone who wants to deploy way smaller models on a budget. vLLM on the other hand seem to have that in mind from the beginning. It can even be used with the [triton inference server as a supported backend](https://github.com/triton-inference-server/vllm_backend). 

## Further Reading
- Check out [this YouTube channel](https://www.youtube.com/channel/UCtAcpQcYerN8xxZJYTfWBMw/videos) for in-depth explanations about popular transformer/LLM architectures. It helped me get through some dense materials clearly, so thank you, Umar!
- This blog on [Serving LLMs by run.ai](https://www.run.ai/blog/serving-large-language-models).