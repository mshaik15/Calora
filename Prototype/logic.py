import requests
import pandas as pd

class Logic:
    def __init__(self):
        self.total_calories = 0
        self.nutrient_totals = pd.DataFrame(columns=['Name', 'Value', 'Unit'])

    def reset_data(self):
        self.total_calories = 0
        self.nutrient_totals = pd.DataFrame(columns=['Name', 'Value', 'Unit'])

    def nutrition_data(self, food):
        url = "https://api.edamam.com/api/nutrition-data"
        params = {
            "app_id": "YOUR ID",
            "app_key": "YOUR API KEY",
            "ingr": food
        }

        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error: {e}")
            return None

    def add_meal(self, food):
        data = self.nutrition_data(food)
        if not data:
            return

        self.total_calories += data.get("calories", 0)
        nutrients = data.get("totalNutrients", {})
        nutrient_dictionary = {
            "FAT": "Total Fat",
            "CHOCDF.net": "Net Carbohydrates",
            "FIBTG": "Fiber",
            "SUGAR": "Sugars",
            "PROCNT": "Protein",
            "CHOLE": "Cholesterol",
            "NA": "Sodium",
            "CA": "Calcium",
            "MG": "Magnesium",
            "K": "Potassium",
            "FE": "Iron",
            "ZN": "Zinc",
            "P": "Phosphorus",
            "VITA_RAE": "Vitamin A",
            "VITC": "Vitamin C",
            "THIA": "Thiamin",
            "VITB6A": "Vitamin B6",
            "FOLDFE": "Folate",
            "VITB12": "Vitamin B12",
            "VITD": "Vitamin D",
            "TOCPHA": "Vitamin E",
            "VITK1": "Vitamin K"
        }

        for nutrient, details in nutrients.items():
            common_name = nutrient_dictionary.get(nutrient, nutrient)
            if common_name in nutrient_dictionary.values():
                if common_name in self.nutrient_totals['Name'].values:
                    self.nutrient_totals.loc[self.nutrient_totals['Name'] == common_name, 'Value'] += round(details["quantity"], 1)
                else:
                    self.nutrient_totals = pd.concat([
                        self.nutrient_totals,
                        pd.DataFrame({
                            'Name': [common_name],
                            'Value': [round(details["quantity"], 1)],
                            'Unit': [details["unit"]]
                        })
                    ], ignore_index=True)
