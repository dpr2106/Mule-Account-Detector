import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, f1_score, precision_recall_curve, auc
import joblib
import numpy as np
import sys

print("1. Loading Data...")
# Make sure the full 116MB DataSet.csv is fully uploaded to Colab!
df = pd.read_csv('DataSet.csv')

print(f"Data shape: {df.shape}")

print("2. Preprocessing...")
# Drop string columns (like 'Oct25', 'Savings', etc.)
numeric_df = df.select_dtypes(include=[np.number])

# Ensure the target column F3924 exists
if 'F3924' in numeric_df.columns:
    # Drop rows where the target label itself is missing (NaN)
    numeric_df = numeric_df.dropna(subset=['F3924'])
    y = numeric_df['F3924']
    X = numeric_df.drop('F3924', axis=1)
else:
    # Fallback if column names got lost
    numeric_df = numeric_df.dropna(subset=[numeric_df.columns[-1]])
    y = numeric_df.iloc[:, -1]
    X = numeric_df.iloc[:, :-1]

print(f"Target distribution:\n{y.value_counts(dropna=False)}")

# Check if we have both normal and fraud cases in the uploaded data
if len(y.unique()) < 2:
    print("\nCRITICAL ERROR: Your data only contains one class (or no mules)! ")
    print("This happens if the CSV wasn't fully uploaded to Colab (it should be 9082 rows, but yours showed 1796).")
    print("Please ensure the entire 116MB file is fully uploaded to Colab before running.")
    sys.exit()

# Fill missing values in the features with 0
X = X.fillna(0)

print("3. Splitting Data...")
# Split into Train and Test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

print("4. Training XGBoost Model...")
# Because our data is highly imbalanced, we need to use scale_pos_weight
class_counts = y_train.value_counts()
scale_pos_weight = class_counts[0] / class_counts[1]
print(f"Using scale_pos_weight: {scale_pos_weight:.2f}")

model = xgb.XGBClassifier(
    scale_pos_weight=scale_pos_weight,
    learning_rate=0.05,
    max_depth=5,
    n_estimators=200,
    random_state=42,
    eval_metric='aucpr' # Area under the Precision-Recall curve is best for imbalanced data
)

model.fit(X_train, y_train)

print("5. Evaluating Model...")
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Calculate AUPRC (Area Under Precision-Recall Curve)
precision, recall, _ = precision_recall_curve(y_test, y_prob)
auprc = auc(recall, precision)
print(f"AUPRC: {auprc:.4f}")

print("6. Extracting Top Features...")
feature_importances = pd.DataFrame(
    {'Feature': X.columns, 'Importance': model.feature_importances_}
).sort_values(by='Importance', ascending=False)

print("\nTop 10 Most Important Features:")
print(feature_importances.head(10))

print("7. Saving Model...")
joblib.dump(model, 'mule_xgboost_model.pkl')
print("Model saved as 'mule_xgboost_model.pkl'. Please download this file from Colab!")
