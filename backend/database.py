import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import random
import string

from query import send_query

# Use a service account.
cred = credentials.Certificate('./firebase-config.json')
app = firebase_admin.initialize_app(cred)
db = firestore.client()

db_ref = db.collection('nutritions')

#doc_id should be equal to username of the user. And we should use that doc_id to update all the information about user

#DONE
async def fetch_all_items_db():
    try:
        # Read data
        #Think as user d will have it's own doccument, user e will have it's own.
        #Get the doc.id. For that example we'll have only one doccument becasue there are only one user
        doc_id = 'EwblBet27qjw8jWLBRfm'
        #For now we consider that we'll add all the items in one field and return it back
        doc_ref = db_ref.document(doc_id)
        # Retrieve the current value of the items field from the document snapshot
        doc_snapshot = doc_ref.get()
        items_list = doc_snapshot.to_dict()['items']
        #For now we consider that we'll add all the items in one field and return it back
        return items_list
    except KeyError:
        return []
        

#DONE
async def add_item(query):

    #We need to add the new items into specific doccument. 
    
    items_list = await fetch_all_items_db()

#Get the doc.id. For that example we'll have only one doccument becasue there are only one user
    doc_id = 'EwblBet27qjw8jWLBRfm'
    doc_ref = db_ref.document(doc_id)

    #Search for new query and add it into the previous array
    query_list = send_query(query)
    print(f"Type of query_list {type(query_list)}, type of items_list {type(items_list)}")
    items_list = items_list + query_list

    #update the database
    doc_ref.update({'items':items_list})
    return "Successfull"
    
    #return list(item)[0]

#DONE
async def remove_item(item_name):
    doc_id = 'EwblBet27qjw8jWLBRfm'
    doc_ref = db_ref.document(doc_id)

    items_list = await fetch_all_items_db()
    #Create a new list without corresponding item_name and push it to the db
    if(len(items_list)!=0):
        new_list = [item for item in items_list if not ('name' in item and item['name'] == item_name)]
    doc_ref.update({'items':new_list})
    return 'Successfull'

