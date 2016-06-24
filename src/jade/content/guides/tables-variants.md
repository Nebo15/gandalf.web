Each table can have infinite number of variants, all of them share same fields (and request structure), but their rules can be totally different. It allows to apply scientific method in managing your design rules: you have a hyphotesis, you create a variant for it, test and make analytical decision on whatever if was true and should influence main decision flow.

Requests to the table can have different types of traffic allocation between variants:

- ```First``` - request will always hit the first version of table. This will turn off split testing.
- ```Percent``` - allows you to manually set how much requests (in percentage) will receive each table variant.
- ```Random``` - randomly distribute requests between all variants.
