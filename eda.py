import pandas as pd
import sys

def analyze_dataset(file_path):
    print("Loading dataset...")
    try:
        # Read only a small chunk first to get columns
        df_preview = pd.read_csv(file_path, nrows=5)
        print(f"Total Columns: {len(df_preview.columns)}")
        
        # Look for potential target columns
        potential_targets = [col for col in df_preview.columns if 'fraud' in col.lower() or 'label' in col.lower() or 'target' in col.lower() or 'class' in col.lower()]
        print(f"Potential Target Columns: {potential_targets}")
        
        # Let's see the last 10 columns as they often contain the target label
        print(f"Last 10 columns: {list(df_preview.columns[-10:])}")
        
        # Read the full dataset
        print("Loading full dataset for shape and memory info...")
        df = pd.read_csv(file_path)
        print(f"Shape: {df.shape}")
        
        # If the last column is the target, let's see its distribution
        last_col = df.columns[-1]
        print(f"\nDistribution of last column '{last_col}':")
        print(df[last_col].value_counts(dropna=False))
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    analyze_dataset("DataSet.csv")
