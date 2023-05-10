import requests
import json
#That function will take a query as an argument and then will return all the nutrition information about the foods as dictionaries in an array.
def send_query(query):
    #We'll keep all foods in the search query in that array
    search_array = []
    # Open the JSON file and load the data for Api-key
    with open('NutritionAPIKey.json') as f:
        data = json.load(f)

    # Extract the API Key and url from json file
    api_key = data['api_key']
    api_url = data['api_url']

    #send the request
    response = requests.get(api_url + query, headers={'X-Api-Key': api_key})
    if response.status_code == requests.codes.ok:
        response_from_api = json.loads(response.text)['items']
        for i in range(len(response_from_api)):
            item = response_from_api[i]
            #Create a dictionary and store the information for the food in it, then add it into the array.
            item_dict = {}
            item_dict["name"]= item['name']
            item_dict["calories"]= item['calories']
            item_dict["fat"]= item['fat_total_g']
            item_dict["protein"]=item['protein_g']
            item_dict["serving_size_g"] = item['serving_size_g']
            search_array.append(item_dict)
        return search_array
    else:
        return f"Error {response.status_code}, {response.text}"

