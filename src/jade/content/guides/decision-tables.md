Here you can edit your decision table. It consist of columns (that describes fields that is required to make a API request to this table) and rows (set of rules, that applied specified order).

There are two types of tables: Scoring and Decision. Scoring table will sum all values in Scoring column and return their total. Decision table will apply all rules one by one, until one rule is passed and return value in Decision column for this rule. If there was no passed rules, we will return values in "Default" section.

More info you can find in our [documentation](http://nebo15.github.io/qbill.docs/gandalf.html#decision-table).
