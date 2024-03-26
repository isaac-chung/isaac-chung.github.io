---
slug: rag-eval-and-observability
title: How to really know if your RAG system is working well.
authors: [ichung]
tags: [RAG, LLM, Evaluation, Tracing, Logging, Observability]
enableComments: true
---

import Figure from '@site/src/components/figure';

We know that building a Retrieval Augmented Generation (RAG) proof of concept is easy, but making it production-ready can be hard. There are no shortage of tips and tricks out there for us to try, but at the end of the day, it all depends on our data and our application. Putting RAG in production is not that different from any other production systems. It is important to understand each component under-the-hood and be able to evaluate the pipeline with clear metrics. 

:::tip[Key questions I'll address are:]

- How to look under-the-hood in a RAG system?
- How to evaluate RAG systems?

:::

<!-- truncate -->

## How to look under-the-hood in a RAG system?
Once the components are set up in the RAG system, it is tempting to spot-check it for performance, and try out some _advanced techniques_ with the promise of performance improvements. However, this isn't the most reliable nor structural approach to debugging and improving RAG. The first thing we should do after getting your first end-to-end RAG response is adding observability. This greatly helps us not only during the transition of our RAG system from POC to production but also in its post-launch maintenance phase.

Observability is crucial in production systems for several main reasons:
1. **Detecting Issues**: Observability allows for the detection of issues and anomalies within a system. By monitoring various metrics, logs, and traces, operators can quickly identify when something goes wrong and take appropriate action to resolve the issue before it impacts users.
2. **Root Cause Analysis**: When problems occur, observability enables engineers to perform root cause analysis efficiently. By examining the data collected from various system components, engineers can trace back the source of the problem and address it effectively, reducing downtime and minimizing the impact on users.
3. **Performance Optimization**: Observability provides insights into the performance of the system. By monitoring metrics such as response times, throughput, and resource utilization, engineers can identify bottlenecks and areas for optimization, leading to better overall performance and user experience.

This could be as simple as logging inputs and outputs of each component (e.g. simple setting in [llama-index](https://docs.llamaindex.ai/en/stable/module_guides/observability/#simple-llm-inputsoutputs)). There are a variety of LLM observability tools to help trace the timings and outputs at each step of a RAG system. Some of these have minimal config needed, have no pricing page, and are open source, and they are:
- [OpenLLMetry](https://github.com/traceloop/openllmetry): Built on top of OpenTelemetry. If you’re using an LLM framework like Haystack, Langchain or LlamaIndex, there is no need to add any annotations to your code.
- [Arize Phoenix](https://github.com/Arize-ai/phoenix): Built on top of teh OpenInference tracing standard, and uses it to trace, export, and collect critical information about your LLM Application in the form of "spans". It also supports several RAG-related analyses and visualizations.

## How to evaluate RAG systems?
Just like any system, it is important to understand how well it is performing and how much improvement is done over the baseline. This doesn’t just involve measuring how fast and how much it costs, but also how good the outputs are. We could take a look at RAG-specific evaluation methods. Per-component evaluations, which are kind of like unit tests, can be done on the retrieval stage and the generation stage separately. 

For retrieval, the goal is to find out given the configuration: the chunking-embedding model, how well can the system retrieve relevant results? Here you would need a golden set of queries and ground truth of relevant documents (or their IDs).  You could use IR metrics like nDCG or Mean Reciprocal Rank (MRR), but for RAG it’s more meaningful to understand 1) the signal to noise ratio of the retrieved context (context precision) and 2) how well it can retrieve all the relevant information required to answer the question (context recall). 

For generation, the goal is to find out, given the relevant documents in the context, 1) how factually accurate is the generated answer (faithfulness), and 2) how relevant is the generated answer to the question (answer relevancy). It is also important to evaluate the full pipeline end to end. This might involve some manual efforts to start with or asking an LLM to verify whether the answer is correct. A proxy for gauging how close the generated answer to the ground truth answer could be semantic similarity. 

Some open source RAG evaluation tools like [Ragas](https://github.com/explodinggradients/ragas) offer readily available guide to evaluate your RAG system with predefined metrics and iterate your RAG system with user feedback in production. Ragas, in particular, offers the ability generate a synthetic test set for “reference-free” evaluation, which means that instead of relying on human-annotated test set, Ragas leverages LLMs under the hood to conduct the evaluations.


## The Bottom Line
Fight the urge of treating the RAG system as a black box. Use a structured approach to evaluate your RAG system in terms of performance and other requirements like latency by adding observability and using evaluation tools. 

## Further Reading
- Catch this talk on ["Transcend the Knowledge Barriers in RAG"](https://pycon.lt/2024/talks/HFXHRV) at PyCon Lithuania
- [12 RAG Pain points](https://towardsdatascience.com/12-rag-pain-points-and-proposed-solutions-43709939a28c)
