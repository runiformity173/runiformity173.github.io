from pythonEnvironment import NOTION_API_KEY
from notion_client import Client
import json
from re import finditer

INCLUDE_PARENTS = True

def idFormat(string):
    if len(string) != 32: raise Exception("id is the wrong length: " + string)
    return "-".join([string[:8],string[8:12],string[12:16],string[16:20],string[20:]])

notion = Client(auth=NOTION_API_KEY)
data_source_id = notion.databases.retrieve("55be4e17-e9ba-46cb-b8f7-e893ab247861")["data_sources"][0]["id"]
data = notion.data_sources.query(data_source_id)
pages = data["results"]
while data["has_more"]:
    data = notion.data_sources.query(data_source_id,start_cursor=data["next_cursor"])
    pages.extend(data["results"])
with open("graph.json","r") as fl:
    graph = json.load(fl)
if "names" not in graph:graph["names"] = {}
if "edges" not in graph:graph["edges"] = {}
if "parents" not in graph:graph["parents"] = {}
for page in pages:
    if page["id"] in graph["names"]:
        print(graph["names"][page["id"]])
        continue
    text = notion.pages.retrieve_markdown(page["id"])["markdown"]
    graph["edges"][page["id"]] = []
    for mention in finditer("(?<=mention\\-page url\\=\"https://app.notion.com/p/)[^\"]+(?=\")",text):
        graph["edges"][page["id"]].append(idFormat(mention.group()))
    try:
        graph["parents"][page["id"]] = page["parent"]["page_id"]
    except:
        graph["parents"][page["id"]] = None
    graph["names"][page["id"]] = page["properties"]["Page"]["title"][0]["plain_text"]
    print(graph["names"][page["id"]])
    with open("graph.json","w") as fl:
        json.dump(graph,fl)