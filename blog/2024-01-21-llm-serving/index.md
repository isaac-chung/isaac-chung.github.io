---
slug: llm-serving
title: 'All about Timing: A quick look at metrics for LLM serving'
authors: [ichung]
tags: [metrics, serving, timing, AI, LLM]
image: ./coach.jpg
enableComments: true
---

import Figure from '@site/src/components/figure';
import coach from './coach.jpg';


How do you measure the performance of LLM serving systems? Production services in engineering are often evaluated using metrics like Requests Per Second (RPS), uptime, and latency. In computer vision systems, Frames Per Second (FPS) is often used as the main model throughput metric for use cases that involve near-real-time detection and tracking. Does serving LLMs have something similar? Certainly. A recent conversation with my team (after they read my [Ollama blog](/blog/what-is-ollama)) got me thinking about additional metrics that we could be tracking. 

:::tip[Key questions I'll address are:]

- What metrics does Ollama provide?
- Why can't I just use tokens per second?
- What other LLM serving metrics should I consider?

:::

<!-- truncate -->

<Figure
  image={coach}
  alt="A baseball coach blowing a whistle while holding a stopwatch."
  caption="Image by OpenAI DALL-E 3."
/>

## What metrics does Ollama provide?
To see the metrics for each response Ollama provides, add the `--verbose` flag after the run command. e.g. `ollama run llama2 --verbose`. Here is an example output with 8 different metrics. 
```
total duration:       58.502942674s
load duration:        7.185349ms
prompt eval count:    31 token(s)
prompt eval duration: 4.044684s
prompt eval rate:     7.66 tokens/s
eval count:           266 token(s)
eval duration:        54.44846s
eval rate:            4.89 tokens/s
```

I added some indentation and rearranged it a bit so that it's easier to discern which parts are together:
```
total duration:       58.502942674s
    1. load duration:        7.185349ms
    2. prompt eval duration: 4.044684s
        prompt eval count:    31 token(s)
        prompt eval rate:     7.66 tokens/s
    3. eval duration:        54.44846s
        eval count:           266 token(s)
        eval rate:            4.89 tokens/s
```

Total duration can be seen as latency (the overall time from receiving a request to returning a response to the user). This metric often includes all of the overhead in addition to the time a model needs to generate a response, e.g. model load time. 

Load duration is the time taken to load the model into memory. Prompt eval is the stage of processing the input prompt. Eval is the stage of generating output.

Tokens per second is a common metric to use for output generation. Looking at the eval rate, this system achieved 4.89 "(output) tokens per second". For comparison, [7-10 tokens/second is thought to be acceptable for general use](https://www.reddit.com/r/LocalLLaMA/comments/162pgx9/what_do_yall_consider_acceptable_tokens_per/).


## Why can't I just use tokens per second?

A single metric is rarely enough to capture the whole picture. It's important to note that all tokens are not made equal. For example, [Llama2 tokenization is 19% longer than that of ChatGPT](https://www.anyscale.com/blog/llama-2-is-about-as-factually-accurate-as-gpt-4-for-summaries-and-is-30x-cheaper), yet it's still much cheaper. This should be considered when serving LLMs of different families.
<!-- There are other factors that may play a role, e.g. while producing more output tokens leads to significantly higher latency than adding more input tokens  -->

Also, the inference system is often used by more than one user at a time (multiple concurrent users). LLMs likely power a bigger system, such as a chat service. You might want to give users a good experience by considering tokens per second _per user_, or tokens per second at different request rates.

## What other LLM serving metrics should I consider?
A common metric to use is **Time To First Token (TTFT)**, which is how quickly users start seeing model outputs after a request is sent. Low waiting times are important in real-time interactions, but less so in offline workloads. This metric measures the time required to a) process the prompt and then b) generate the first output token. From the example above, the TTFT is just over 4 seconds as the load time was almost negligible.

Another way to represent tokens per second is its inverse: **Time Per Output Token (TPOT)**, the time to generate one output token for each request. This metric can be used to perceive the "speed" of the model. From the example above, the TPOT is 200ms per token.

## Final Thought (yes, just one)
Overall, it's important to keep the goal of the system and user requirements in mind and avoid blindly optimizing metrics for optimization's sake. 

## Further Reading
Here are some extra resources for some background on how LLMs generate text and deeper dives on LLM serving:
1. [How LLMs use decoder blocks for generation](https://jalammar.github.io/illustrated-gpt2/#part-1-got-and-language-modeling) with illustrations
2. [Best Practices for LLM Inference](https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices) from MosaicML
3. [Faster Mixtral inference with TensorRT-LLM](https://www.baseten.co/blog/faster-mixtral-inference-with-tensorrt-llm-and-quantization/) by Baseten