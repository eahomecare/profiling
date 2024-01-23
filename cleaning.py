import pandas as pd
import json
import sqlite3
import hashlib
import dask.dataframe as dd

# Load the raw data
file_path = 'raw.csv'
df = pd.read_csv(file_path)

df_copy = df.copy()

with open('config.json', 'r') as config_file:
    config = json.load(config_file)
    email_domain_whitelist = config.get('email_domain_whitelist', [])
    plan_id_mapping = config.get('plan_id_mapping', {})
    program_id = config.get('program_id')
    client_id = config.get("client_id")

df_rejected = pd.DataFrame(columns=df.columns.tolist() + ['rejected_reason'])
email_rejected_mask = ~df_copy['EMAIL'].str.lower().str.endswith(tuple(email_domain_whitelist)) | (df_copy['EMAIL'].str.lower().str.match(r'^null@') | df_copy['EMAIL'].str.lower().str.match(r'^nouser@'))
df_rejected[df.columns] = df_copy.loc[email_rejected_mask]
df_rejected['rejected_reason'] = 'email issue'

df_copy['BIN'] = df_copy['BIN'].astype(str)
plan_not_found_rejected_mask = ~df_copy['BIN'].isin(plan_id_mapping.keys())
df_rejected_new = pd.DataFrame(columns=df_copy.columns.tolist() + ['rejected_reason'])
df_rejected_new[df_copy.columns] = df_copy.loc[plan_not_found_rejected_mask]
df_rejected_new['rejected_reason'] = 'plan not found'
df_rejected = pd.concat([df_rejected, df_rejected_new], ignore_index=True)

df_copy = df_copy.loc[~plan_not_found_rejected_mask]
df_copy = df_copy.loc[~email_rejected_mask]
print("filtered email issues & plan issues")

df_axis = df_copy.copy()

df_axis.rename(columns={'FIRSTNAME': 'first_name', 'LASTNAME': 'last_name','EMAIL': 'original_email','PRIMARYCARD':'primarycard','RMNAME':'rmname','MOBILE':'mobile',"BIN":"bin",'ACCOUNTSERNO':'accountserno','CARDSERNO':'cardserno','CARD_CREATION_DATE':'card_creation_date'}, inplace=True)
df_axis['first_name'] = df_axis['first_name'].apply(lambda x: 'unidentified first name' if pd.isna(x) or x.lower() == 'unidentified first name' else x)
df_axis['last_name'] = df_axis['last_name'].apply(lambda x: 'unidentified last name' if pd.isna(x) or x.lower() == 'unidentified last name' else x)
df_axis['bin'] = df_axis['bin'].astype(str)
df_axis['mobile'] = df_axis['mobile'].astype(str)
df_axis['plan_id'] = df_axis['bin'].map(lambda x: plan_id_mapping.get(x, 'plan not found'))
df_axis['program_id'] = program_id
df_axis['client_id'] = client_id
df_axis['createpassword'] = df_axis['first_name'].str[0] + df_axis['mobile'].str[-4:] + df_axis['last_name'].str[0] + df_axis['original_email'].str[:2]
df_axis['mobile'] = df_axis['mobile'].astype(str).apply(lambda x: f"({x[:2]}){x[2:]}" if (x.startswith('91') and len(x) == 12) else x)
df_axis['emailaddress'] = df_axis['cardserno'].astype(str) + "___" + df_axis['accountserno'].astype(str) + "___" + df_axis['original_email']
df_axis['regCode'] = df_axis['program_id'] + df_axis['client_id'] + df_axis['plan_id'] + df_axis.groupby('program_id').cumcount().add(0).astype(str).str.zfill(12)

# Convert the cleaned DataFrame to a Dask DataFrame
ddf = dd.from_pandas(df_axis, npartitions=2)

# Add a hash column to the Dask DataFrame
ddf['hash'] = ddf.apply(lambda row: hashlib.sha256((row['email'] + row['phone']).encode()).hexdigest(), axis=1)

# Compute the hashes and convert them to a Python set
hashes = set(ddf['hash'].compute())

# Function to check for duplicates
def check_duplicates(df):
    df['hash'] = df.apply(lambda row: hashlib.sha256((row['email'] + row['phone']).encode()).hexdigest(), axis=1)
    df['is_duplicate'] = df['hash'].isin(hashes)
    return df

# Apply the function to each partition of the Dask DataFrame
ddf = ddf.map_partitions(check_duplicates)

# Save the cleaned data to a SQLite database
OUT_FILE = "master_collection.db"
db = f"sqlite:///{OUT_FILE}"
ddf.to_sql("customers", db)

# Save the rejected entries to a CSV file
df_rejected.to_csv('rejected.csv', index=False)

