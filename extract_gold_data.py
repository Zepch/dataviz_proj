import openpyxl
import json

# Load the Excel file
wb = openpyxl.load_workbook('data/above-ground-gold-stocks.xlsx')
sheet = wb.active

print("Sheet name:", sheet.title)
print("\nFirst 20 rows:")
for i, row in enumerate(sheet.iter_rows(values_only=True), 1):
    if i <= 20:
        print(f"Row {i}: {row}")
    else:
        break

print("\n" + "="*80)
print("Please provide the row numbers and column letters for:")
print("- Years (2010-2024)")
print("- Total Gold")
print("- Jewellery")
print("- Bars & Coins") 
print("- Central Banks")
print("- Other/Technology")
