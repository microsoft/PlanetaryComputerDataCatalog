# Querying for data

You can use the Planetary Query Endpoints to find data matching your interests.

```python
from satsearch import Search

search = Search(bbox=[-110, 39.5, -105, 40.5])
print('bbox search: %s items' % search.found())

search = Search(datetime='2018-02-12T00:00:00Z/2018-03-18T12:31:12Z')
print('time search: %s items' % search.found())

search = Search(query={'eo:cloud_cover': {'lt': 10}})
print('cloud_cover search: %s items' % search.found()) 
```

## API reference

The OpenAPI docs are availabe at <https://example.com>
