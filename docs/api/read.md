
# Reading data

You can use the Planetary Data Endpoints to download data you've queried for. 

## Example

```python
from satstac import ItemCollection

search = Search.search(bbox=[-110, 39.5, -105, 40.5],
               datetime='2018-02-01/2018-02-10',
               query=["eo:cloud_cover<25"],
               collections=['sentinel-s2-l2a'])
items = search.items()
print(items.summary())

items.save('test.json')
items2 = ItemCollection.open('test.json')

print(items2.summary(['date', 'id', 'eo:cloud_cover']))
```

## More to come

Stay tuned.

### With sub headings

Another section.
