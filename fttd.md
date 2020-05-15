# Functional Tensor-Train (FTT) Decomposition Models
This repository contains the code for my Master's thesis, focusing on FTT Decomposition models for regression and
classification. Here the custom Python estimators and numerical experiments can be found. The maximum likelihood estimator (MLE) classes are denoted as FTTR and FTTC, 
while the variational Bayesian (VB) classes are denoted as VBFTTR and VBFTTC, for regression and classification respectively. 
All estimators can be found in `models.py` , and follow the [Scikit-learn](https://scikit-learn.org/stable/) API, 
where methods like `fit` and `predict` can be called. 

The full thesis can be found on the [University of Toronto TSpace repository](https://tspace.library.utoronto.ca/handle/1807/9944) 
for graduate studies theses. It is set to made available after the 2020 November convocation. 


## Dependencies
Make sure all dependencies are installed from `requirements.txt`. 
```
pip install -r requirements.txt
```

## Numerical Experiments
Numerical experiments are in the `experiments` folder, and have the following structure for the MLE and VB estimators:  
* Synthetic regression data: `test_regression.py`
* UCI Regression data: `uci_exp` folder
* Synthetic classification data: `test_class.py`
* Real world classification data: `test_realclass.py`

Note: The `uci_data` folder for UCI regression datasets is not included in the repository since the size is about 2GB.  