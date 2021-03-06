# Topic Modeling with News Headlines
This mini-project serves as a familiarization exercise with natural language processing (NLP). Here we
study the news headlines taken from the [Million Headlines](https://www.kaggle.com/therohk/million-headlines) 
dataset from Kaggle, which contains news headlines published over a period of seventeen years (2003-2019) by ABC (Australian
Broadcasting Corp). 

The purpose of the project is to showcase how to approach an NLP exercise, including 
* data cleaning
  * word tokenizing
  * stop words removal
  * word stemming / lemmatizing
* word frequency
* topic modeling with Latent Dirichlet Allocation (LDA),

with the following packages:
* NLTK
* spaCy
* wordcloud
* Gensim
* Scikit-learn


## Dependencies
Make sure all dependencies are installed from 'requirements.txt'. 
```
pip install -r requirements.txt
```

## Usage
* [data](https://github.com/isaac-chung/data-science-projects/blob/master/Topic%20Modeling/abcnews-date-text.csv) available as `abcnews-date-text.csv`
* a [jupyter notebook](https://github.com/isaac-chung/data-science-projects/blob/master/Topic%20Modeling/news-headlines.ipynb) 
containing functions and step-by-step guide for the project

Assumptions made are stated in the notebook markups. 